// controllers/taskController.js
import Task from "../models/Task.js";
import Employee from "../models/Employee.js";
import Lead from "../models/Lead.js";
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid"; // For generating unique taskId

// Fetch all tasks
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("employee", "name")
      .populate("lead", "name company");

    res.status(200).json({ success: true, tasks });
  } catch (error) {
    console.error(error, "error");
    res.status(500).json({ success: false, message: "Failed to fetch tasks." });
  }
};

// Create task
export const createTask = async (req, res) => {
  try {
    const { leadId, description, priority, deadline, employeeId } = req.body;

    // Validate required fields
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

// Fetch a single task by ID
export const getTask = async (req, res) => {
  const { id } = req.params; // Extract task ID from the request URL
  try {
    const task = await Task.findById(id)
      .populate("assignedTo", "name email")
      .populate("lead", "name company");

    if (!task) return res.status(404).json({ error: "Task not found." });
    res.status(200).json({ success: true, task });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch the task." });
  }
};

// Update task details
export const updateTask = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const task = await Task.findByIdAndUpdate(id, updates, { new: true });
    if (!task) return res.status(404).json({ error: "Task not found." });
    res.status(200).json({ success: true, task });
  } catch (error) {
    res.status(500).json({ error: "Failed to update task." });
  }
};

// Get tasks assigned to an employee
export const getEmployeeTasks = async (req, res) => {
  try {
    const employeeId = new mongoose.Types.ObjectId(req.employee._id); // Assuming the middleware attaches user info to the request

    // Fetch tasks assigned to the employee
    const tasks = await Task.find({ 'employee': employeeId }).populate('lead');
    
    if (tasks.length === 0) {
      return res.status(404).json({ success: false, error: "No tasks found." });
    }

    res.status(200).json({ success: true, tasks });
  } catch (error) {
    console.error(error);  // Log the actual error
    res.status(500).json({ success: false, error: "Failed to fetch tasks." });
  }
};

// Function to assign a task after a lead is assigned to an employee
export const assignTask = async (lead, employee) => {
  try {
    const task = new Task({
      taskId: `task-${lead._id}-${Date.now()}`,  // Generate a unique task ID or use some logic
      lead: lead._id,
      employee: employee._id,
      description: `Follow up with lead ${lead.name}`,
      status: "Pending",  // Default task status
    });

    // Save the task in the database
    await task.save();
  } catch (error) {
    console.error("Error creating task:", error);
    throw new Error("Failed to create task");
  }
};
