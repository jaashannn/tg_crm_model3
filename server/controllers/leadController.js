import Lead from "../models/Lead.js";
import Employee from "../models/Employee.js";
import { assignTask } from './taskController.js';  // Import the assignTask function from taskController
import ExcelJS from "exceljs";
import { v4 as uuidv4 } from 'uuid';
import Task from "../models/Task.js";
import Account from "../models/Account.js";


// Export Leads to Excel
export const exportLeads = async (req, res) => {
  try {
    const leads = await Lead.find();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Leads");

    worksheet.columns = [
      { header: "Lead ID", key: "leadId", width: 15 },
      { header: "Name", key: "name", width: 20 },
      { header: "Email", key: "email", width: 25 },
      { header: "Phone", key: "phone", width: 15 },
      { header: "Company", key: "company", width: 20 },
      { header: "Source", key: "source", width: 15 },
      { header: "Status", key: "status", width: 15 },
    ];

    leads.forEach((lead) => {
      worksheet.addRow({
        leadId: lead.leadId,
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        company: lead.company,
        source: lead.source,
        status: lead.status,
      });
    });

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=leads.xlsx");

    await workbook.xlsx.write(res);
    res.status(200).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to export leads." });
  }
};




const personalEmailDomains = [
  "gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "aol.com",
  "icloud.com", "protonmail.com", "zoho.com", "gmx.com", "mail.com", "yandex.com"
];

export const importLeads = async (req, res) => {
  const { leads } = req.body;

  if (!leads || !Array.isArray(leads)) {
    return res.status(400).json({ success: false, error: "Invalid leads data" });
  }

  try {
    // Normalize and validate leads
    const validatedLeads = leads.map((lead) => {
      const mappedLead = {
        leadId: lead.leadId || lead["Lead ID"] || lead["lead id"] || uuidv4(),
        name: (lead.name || lead["Name"] || lead["Full Name"] || "").trim(),
        email: (lead.email || lead["Email"] || lead["Email Address"] || "").trim().toLowerCase(),
        phone: (lead.phone || lead["Phone"] || lead["Phone Number"] || "").trim(),
        company: (lead.company || lead["Company"] || lead["Company Name"] || "").trim(),
        source: (lead.source || lead["Source"] || lead["Lead Source"] || "Other").trim(),
        status: (lead.status || lead["Status"] || "Unassigned").trim(),
        role: (lead.role || lead["Role"] || "Evaluator").trim(),
        notes: (lead.notes || lead["Notes"] || "").trim(),
        meetingBooked: Boolean(lead.meetingBooked || lead["Meeting Booked"] || false),
        fetchedFromWebsiteAt: lead.fetchedFromWebsiteAt || lead["Fetched From Website At"] || Date.now(),
      };

      if (!mappedLead.email || !mappedLead.source) {
        return { error: `Missing required fields for lead: ${mappedLead.leadId || "Unknown"}` };
      }

      return mappedLead;
    });

    // Separate valid leads and errors
    const errors = validatedLeads.filter((lead) => lead.error);
    let validLeads = validatedLeads.filter((lead) => !lead.error);

    // Find existing leads to prevent duplicates
    const existingLeads = await Lead.find({
      $or: [
        { leadId: { $in: validLeads.map((lead) => lead.leadId) } },
        { email: { $in: validLeads.map((lead) => lead.email) } },
      ],
    });

    const duplicateErrors = existingLeads.map((lead) => ({
      leadId: lead.leadId,
      email: lead.email,
      error: "Duplicate leadId or email",
    }));

    // Remove duplicates from validLeads
    validLeads = validLeads.filter(
      (lead) => !existingLeads.some((existing) => existing.email === lead.email)
    );

    const leadBulkOps = [];

    for (const lead of validLeads) {
      const emailDomain = lead.email.split("@")[1];

      if (!personalEmailDomains.includes(emailDomain)) {
        const companyName = emailDomain.split(".")[0];

        let account = await Account.findOne({ companyName });

        if (!account) {
          account = new Account({
            companyName,
            website: `https://www.${emailDomain}`,
            companyLinkedin: "",
            employeeSize: 0,
            revenue: "Unknown",
            industry: "Unknown",
            leads: [],
          });
          await account.save();
        }

        // lead.company = companyName; // ✅ Store the actual company name
        // console.log(lead);
        lead.account = account._id; // ✅ Store account ID separately// ✅ Assigning ObjectId
        account.leads.push(lead.leadId); // ✅ Push lead _id instead of leadId
        await account.save();
      } else {
        lead.company = null; // No company for personal emails
      }

      leadBulkOps.push({ insertOne: { document: lead } });
    }

    if (leadBulkOps.length > 0) {
      await Lead.bulkWrite(leadBulkOps);
    }

    res.status(201).json({
      success: true,
      message: "Leads imported successfully",
      importedCount: validLeads.length,
      errors,
      duplicates: duplicateErrors,
    });
  } catch (error) {
    console.error("Error importing leads:", error);
    res.status(500).json({ success: false, error: "Failed to import leads" });
  }
};


// Fetch all leads
export const getLeads = async (req, res) => {
  try {
    const leads = await Lead.find().populate("assignedTo", "name email");
    res.status(200).json({ success: true, leads });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch leads." });
  }
};

// Controller for creating a lead

export const createLead = async (req, res) => {
  try {
    const { name, email, phone, source, notes } = req.body;
    // console.log(req.body);

    // Generate a unique leadId using UUID
    const leadId = uuidv4();

    // Check if the lead already exists (by email)
    const existingLead = await Lead.findOne({ email });
    if (existingLead) {
      return res.status(400).json({ success: false, error: "Lead with the same email already exists." });
    }

    // Extract domain from email
    const emailDomain = email.split("@")[1];

    // Check if the domain is in the personal email domains list
    if (personalEmailDomains.includes(emailDomain)) {
      // Create a lead without associating it with an account
      const newLead = new Lead({
        leadId,
        name,
        email,
        phone,
        company: null, // No company for personal emails
        source,
        notes,
      });

      await newLead.save();

      return res.status(201).json({ success: true, message: "Lead created successfully without an account!", lead: newLead });
    }

    // Extract company name from domain
    const companyName = emailDomain.split(".")[0];

    let account = await Account.findOne({ companyName });

    // If the account does not exist, create it
    if (!account) {
      account = new Account({
        companyName,
        website: `https://www.${emailDomain}`,
        companyLinkedin: "",
        employeeSize: 0,
        revenue: "Unknown",
        industry: "Unknown",
        leads: [],
      });
      await account.save();
    }

    // Create a new lead and associate it with the found/created account
    const newLead = new Lead({
      leadId,
      name,
      email,
      phone,
      company: account._id,
      source,
      notes,
    });

    // Save the lead
    await newLead.save();

    // Update the account to include the new lead
    account.leads.push(newLead._id);
    await account.save();

    return res.status(201).json({ success: true, message: "Lead created successfully!", lead: newLead, account });
  } catch (error) {
    console.error("Error creating lead:", error);
    return res.status(500).json({ success: false, error: "Server error while creating lead." });
  }
};

// Fetch a single lead by ID
export const getLead = async (req, res) => {
  const { id } = req.params;
  try {
    const lead = await Lead.findById(id).populate("assignedTo", "name email");
    if (!lead) {
      return res.status(404).json({ success: false, error: "Lead not found." });
    }
    res.status(200).json({ success: true, lead });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch the lead." });
  }
};

// Update lead details
export const bulkLead = async (req, res) => {

  try {
    const { employeeId, leadIds, description, priority, deadline } = req.body;

    // Validate input
    if (!employeeId || !leadIds || !description || !priority || !deadline) {
      return res.status(400).json({ success: false, error: 'All fields are required.' });
    }

    // Create tasks for each lead
    const tasks = leadIds.map((leadId) => ({
      employeeId,
      leadId,
      description,
      priority,
      deadline,
    }));

    // Save tasks to the database
    await Task.insertMany(tasks);

    res.status(200).json({ success: true, message: 'Tasks assigned successfully.' });
  } catch (error) {
    console.error('Error in bulk assignment:', error);
    res.status(500).json({ success: false, error: 'Failed to assign tasks.' });
  }
};


export const updateLead = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const lead = await Lead.findByIdAndUpdate(id, updates, { new: true });
    if (!lead) return res.status(404).json({ error: "Lead not found." });
    res.status(200).json({ success: true, lead });
  } catch (error) {
    res.status(500).json({ error: "Failed to update lead." });
  }
};

// Assign a lead to an employee and create a task for the employee
export const assignLead = async (req, res) => {
  const { id } = req.params;
  const { employeeId } = req.body;

  try {
    const employee = await Employee.findById(employeeId);
    if (!employee) return res.status(404).json({ error: "Employee not found." });

    const lead = await Lead.findByIdAndUpdate(
      id,
      { assignedTo: employee._id, status: "Assigned" },
      { new: true }
    );
    if (!lead) return res.status(404).json({ error: "Lead not found." });

    await assignTask(lead, employee);  // Create task after assigning the lead

    res.status(200).json({ success: true, lead });
  } catch (error) {
    res.status(500).json({ error: "Failed to assign lead and create task." });
  }
};

// Get leads assigned to a specific employee
export const getAssignedLeads = async (req, res) => {
  const { employeeId } = req.params;
  try {
    const assignedLeads = await Lead.find({ assignedTo: employeeId });
    res.status(200).json({ success: true, assignedLeads });
  } catch (error) {
    res.status(500).json({ error: "Error fetching leads." });
  }
};


export const deleteLead = async (req, res) => {
  try {
    const { id } = req.params;
    // console.log(id);

    // Find the lead by leadId
    const lead = await Lead.findById(id).populate("assignedTo", "name email");
    // console.log(lead,"its lead ");
    if (!lead) {
      return res.status(404).json({ success: false, error: "Lead not found." });
    }

    // If the lead is associated with an account, remove it from the account's leads array
    if (lead.company) {
      // Assuming lead.company is a string that corresponds to the company name
      const account = await Account.findOne({ companyName: lead.company });

      // if (account) {
      //   await Account.findByIdAndUpdate(account._id, {
      //     $pull: { leads: lead._id },
      //   });
      // } else {
      //   console.log("Company not found for lead:", lead);
      //   return res.status(400).json({ success: false, error: "Company not found." });
      // }
    }

    // Delete the lead
    await Lead.deleteOne({ _id: id });

    return res.status(200).json({ success: true, message: "Lead deleted successfully." });
  } catch (error) {
    console.error("Error deleting lead:", error);
    return res.status(500).json({ success: false, error: "Server error while deleting lead." });
  }
};


export const bulkDeleteLeads = async (req, res) => {
  try {
    // console.log("entered bulk delete");
    const { leadIds } = req.body; // Expect an array of lead IDs in the request body
    // console.log(req.body);
    // Validate input
    if (!leadIds || !Array.isArray(leadIds) || leadIds.length === 0) {
      return res.status(400).json({ success: false, error: "Please provide valid lead IDs." });
    }

    // Fetch all leads to be deleted
    const leads = await Lead.find({ _id: { $in: leadIds } });
    // console.log(leads);

    // If no leads are found, return an error
    if (leads.length === 0) {
      return res.status(404).json({ success: false, error: "No leads found with the provided IDs." });
    }

    // Remove leads from associated accounts (if applicable)
    for (const lead of leads) {
      if (lead.company) {
        const account = await Account.findOne({ companyName: lead.company });
        if (account) {
          await Account.findByIdAndUpdate(account._id, {
            $pull: { leads: lead._id },
          });
        }
      }
    }

    // Delete all leads in bulk
    await Lead.deleteMany({ _id: { $in: leadIds } });

    return res.status(200).json({ success: true, message: `${leadIds.length} leads deleted successfully.` });
  } catch (error) {
    console.error("Error deleting leads in bulk:", error);
    return res.status(500).json({ success: false, error: "Server error while deleting leads." });
  }
};

// Bulk fetch leads by IDs (GET request)
// router.get('/bulk',
  
  
  export const accountLeads = async (req, res) => {
    // console.log("entered account leads");
  const { leadIds } = req.body;
  // console.log(leadIds );

 
  if (!leadIds || !Array.isArray(leadIds)) {
    return res.status(400).json({ success: false, error: "Invalid lead IDs" });
  }

  try {
    const leads = await Lead.find({ leadId: { $in: leadIds } });
    res.status(200).json(leads);
  } catch (error) {
    console.error("Error fetching leads:", error);
    res.status(500).json({ success: false, error: "Failed to fetch leads" });
  }
};