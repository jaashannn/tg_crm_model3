import Employee from '../models/Employee.js';
import Leave from '../models/Leave.js';

// Add leave for an employee
const addLeave = async (req, res) => {
  try {
    const { userId, leaveType, startDate, endDate, reason } = req.body;
    const employee = await Employee.findOne({ userId });

    if (!employee) {
      return res.status(404).json({ success: false, error: "Employee not found." });
    }

    const newLeave = new Leave({
      employeeId: employee._id,
      leaveType,
      startDate,
      endDate,
      reason
    });

    await newLeave.save();
    return res.status(200).json({ success: true, message: "Leave added successfully." });
  } catch (error) {
    console.error("Error adding leave:", error.message);
    return res.status(500).json({ success: false, error: "Leave add server error" });
  }
};

// Get leaves of an employee (or admin to get all)
const getLeave = async (req, res) => {
  try {
    const { id, role } = req.params;
    let leaves;
    
    if (role === "admin") {
      leaves = await Leave.find({ employeeId: id });
    } else {
      const employee = await Employee.findOne({ userId: id });
      if (!employee) {
        return res.status(404).json({ success: false, error: "Employee not found." });
      }
      leaves = await Leave.find({ employeeId: employee._id });
    }

    return res.status(200).json({ success: true, leaves });
  } catch (error) {
    console.error("Error fetching leave:", error.message);
    return res.status(500).json({ success: false, error: "Leave fetch server error" });
  }
};

// Get all leaves with employee details
const getLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find().populate({
      path: 'employeeId',
      populate: [
        {
          path: 'department',
          select: 'dep_name'
        },
        {
          path: 'userId',
          select: 'name'
        }
      ]
    });

    return res.status(200).json({ success: true, leaves });
  } catch (error) {
    console.error("Error fetching all leaves:", error.message);
    return res.status(500).json({ success: false, error: "Failed to fetch all leaves." });
  }
};

// Get detailed leave info
const getLeaveDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const leave = await Leave.findById(id).populate({
      path: 'employeeId',
      populate: [
        {
          path: 'department',
          select: 'dep_name'
        },
        {
          path: 'userId',
          select: 'name profileImage'
        }
      ]
    });

    if (!leave) {
      return res.status(404).json({ success: false, error: "Leave not found." });
    }

    return res.status(200).json({ success: true, leave });
  } catch (error) {
    console.error("Error fetching leave detail:", error.message);
    return res.status(500).json({ success: false, error: "Leave detail server error" });
  }
};

// Update leave status or other fields
const updateLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, startDate, endDate, reason } = req.body;  // You can add other fields here for future flexibility

    const leave = await Leave.findByIdAndUpdate(
      { _id: id },
      { status, startDate, endDate, reason },  // Update multiple fields
      { new: true }  // Ensures the updated leave is returned
    );

    if (!leave) {
      return res.status(404).json({ success: false, error: "Leave not found." });
    }

    return res.status(200).json({ success: true, leave });  // Return updated leave object
  } catch (error) {
    console.error("Error updating leave:", error.message);
    return res.status(500).json({ success: false, error: "Failed to update leave." });
  }
};

export { addLeave, getLeave, getLeaves, getLeaveDetail, updateLeave };
