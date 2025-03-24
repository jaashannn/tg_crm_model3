import Task from "../models/Task.js";
import Employee from "../models/Employee.js";
import Lead from "../models/Lead.js";
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid"; // For generating unique taskId

import Notification from "../models/Notification.js"; // Import Notification Model


// Fetch all tasks
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate("employee", "name").populate("lead", "name company");
    // console.log(tasks)
    res.status(200).json({ success: true, tasks });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks." });
    console.log(error, "error");
  }
};


export const createTask = async (req, res) => {
  try {
    const { employeeId, leadId, description, priority, deadline } = req.body;

    // Validation
    if (!employeeId || !description || !priority || !deadline) {
      return res.status(400).json({ success: false, error: "Missing required fields." });
    }

    // Check if employee exists
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ success: false, error: "Employee not found." });
    }

    // If leadId is provided, check if it exists
    let lead = null;
    if (leadId) {
      lead = await Lead.findById(leadId);
      if (!lead) {
        return res.status(404).json({ success: false, error: "Lead not found." });
      }
    }

    // Create the task
    const task = new Task({
      taskId: uuidv4(),
      lead: lead ? lead._id : null,
      employee: employee._id,
      createdBy: req.user._id, // Admin ID
      assignedBy: req.user._id,
      description,
      priority,
      deadline,
    });

    await task.save();

    // ✅ Add Notification for the Assigned Employee
    const notification = new Notification({
      employeeId: employee._id,
      message: `You have been assigned a new task: "${description}". Priority: ${priority}. Deadline: ${new Date(deadline).toLocaleString()}`,
    });

    await notification.save();

    res.status(201).json({
      success: true,
      message: "Task created and notification sent successfully.",
      task,
    });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({
      success: false,
      error: "An error occurred while creating the task.",
    });
  }
};



// Fetch a single task by ID
export const getTask = async (req, res) => {
  const { id } = req.params; // Extract task ID from the request URL
  try {
    const task = await Task.findById(id)
      .populate("employee", "name email")  // Adjusting reference to "employee"
      .populate("lead", "name company");  // Adjusting reference to "lead"
    
    if (!task) return res.status(404).json({ error: "Task not found." });
    
    res.status(200).json({ success: true, task });
  } catch (error) {
    console.error("Error fetching task:", error.message);
    res.status(500).json({ success: false, error: "Failed to fetch the task." });
  }
};



// Update the task status by ID
export const updateTaskStatus = async (req, res) => {
  // console.log("update task trigged")
  const { id } = req.params; // Extract the task ID from the request URL
  const { status } = req.body; // Get the new status from the request body

  try {
    // Validate the provided status
    if (!["Pending", "In Progress", "Completed", "Skipped"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    // Find and update the task's status
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ error: "Task not found" });

    // console.log(task)

    // Update the status and update the 'updatedAt' field
    task.status = status;
    task.updatedAt = Date.now();
    
    await task.save(); // Save the task with the updated status
    // console.log(task)

    res.status(200).json({ success: true, task }); // Return the updated task
  } catch (error) {
    console.error("Error updating task status:", error);
    res.status(500).json({ success: false, error: "Failed to update task status" });
  }
};


export const getEmployeeTasks = async (req, res) => {
  try {
    // const some = req.employee._id;
    // console.log(some,'some')
    const employeeId = new mongoose.Types.ObjectId(req.employee._id); // Assuming the middleware attaches user info to the request
    // console.log(employeeId, "idemployee");

    // Find tasks without populating the lead to check if there are any tasks
    const tasks = await Task.find({ 'employee': employeeId }).populate('lead');
    // console.log(tasks, 'tasks without population');

    if (tasks.length === 0) {
      return res.status(404).json({ success: false, error: "No tasks found." });
    }

    res.status(200).json({ success: true, tasks: tasks });

    // Now populate the lead field only if tasks exist
    // const populatedTasks = await Task.find({ 'employee': employeeId }).populate('lead');
    // console.log(populatedTasks, 'populated tasks');

    // res.status(200).json({ success: true, tasks: populatedTasks });
  } catch (error) {
    console.error(error);  // Log the actual error
    res.status(500).json({ success: false, error: "Failed to fetch tasks." });
  }
};


// Function to assign task after a lead is assigned to an employee
export const assignTask = async (req, res) => {
  try {
    const { employeeId, leadId, description, priority, deadline } = req.body;

    // console.log(req.body,"its body")

    // Validation
    if ( !employeeId || !description || !priority || !deadline) {
      return res.status(400).json({ success: false, error: "Missing required fields." });
    }

    // Check if employee exists
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ success: false, error: "Employee not found." });
    }

    // If leadId is provided, check if it exists
    let lead = null;
    if (leadId) {
      lead = await Lead.findById(leadId);
      if (!lead) {
        return res.status(404).json({ success: false, error: "Lead not found." });
      }
    }

    // Create the task
    const task = new Task({
      taskId: uuidv4(), // Generate unique taskId
      lead: lead ? lead._id : null,
      employee: employee._id,
      createdBy: req.user._id, // Assuming `req.user` contains the admin's ID
      assignedBy: req.user._id, // Admin assigning the task
      description,
      priority,
      deadline,
    });

    await task.save();

    res.status(201).json({
      success: true,
      message: "Task created successfully.",
      task,
    });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({
      success: false,
      error: "An error occurred while creating the task.",
    });
  }
  };

  export const bulkTask = async (req, res) => {
    try {
      const { employeeId, leadIds, description, priority, deadline } = req.body;
      // console.log(req.body, "its body");
  
      // Validate input
      if (!employeeId || !leadIds || !description || !priority || !deadline) {
        return res.status(400).json({ success: false, error: 'All fields are required.' });
      }
  
      // Get the logged-in user's ID (assuming it's stored in req.user)
      const createdBy = req.user._id; // The user creating the task
      const assignedBy = req.user._id; // The user assigning the task
  
      // Create tasks for each lead
      const tasks = leadIds.map((leadId) => ({
        taskId: new mongoose.Types.ObjectId().toString(), // Generate a unique task ID
        lead: leadId, // Use `lead` instead of `leadId` to match the schema
        employee: employeeId, // Use `employee` instead of `employeeId` to match the schema
        createdBy, // Add the `createdBy` field
        assignedBy, // Add the `assignedBy` field
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