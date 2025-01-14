import Lead from "../models/Lead.js";
import Employee from "../models/Employee.js";
import { assignTask } from './taskController.js';  // Import the assignTask function from taskController
import ExcelJS from "exceljs";

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

// Import Leads from client-side data
export const importLeads = async (req, res) => {
  const { leads } = req.body;

  if (!leads || !Array.isArray(leads)) {
    return res.status(400).json({ success: false, error: "Invalid leads data" });
  }

  try {
    const validatedLeads = leads.filter(
      (lead) =>
        lead.leadId && lead.name && lead.email && lead.source // Ensure required fields
    );

    if (validatedLeads.length !== leads.length) {
      return res.status(400).json({
        success: false,
        error: "Some leads are missing required fields (leadId, name, email, source).",
      });
    }

    const newLeads = validatedLeads.map((lead) => ({
      leadId: lead.leadId,
      name: lead.name,
      email: lead.email,
      phone: lead.phone || "",
      company: lead.company || "",
      source: lead.source,
      status: lead.status || "New",
    }));

    await Lead.insertMany(newLeads);

    res.status(201).json({ success: true, message: "Leads imported successfully" });
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

// Create a new lead
export const createLead = async (req, res) => {
  const { leadId, name, email, phone, company, source } = req.body;
  try {
    const lead = new Lead({ leadId, name, email, phone, company, source });
    await lead.save();
    res.status(201).json({ success: true, lead });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create lead." });
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
