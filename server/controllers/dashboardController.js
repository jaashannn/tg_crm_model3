import Department from "../models/Department.js";
import Employee from "../models/Employee.js";
import Leave from "../models/Leave.js";

// Controller to get dashboard summary
const getSummary = async (req, res) => {
  try {
    // Get total number of employees
    const totalEmployees = await Employee.countDocuments();

    // Get total number of departments
    const totalDepartments = await Department.countDocuments();

    // Get total salaries by aggregating the sum of all employee salaries
    const totalSalaries = await Employee.aggregate([
      { $group: { _id: null, totalSalary: { $sum: "$salary" } } }
    ]);

    // Get distinct employees who applied for leave
    const employeeAppliedForLeave = await Leave.distinct('employeeId');

    // Get leave status counts (approved, rejected, pending)
    const leaveStatus = await Leave.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    // Calculate the leave summary based on the leave status
    const leaveSummary = {
      appliedFor: employeeAppliedForLeave.length,
      approved: leaveStatus.find(item => item._id === "Approved")?.count || 0,
      rejected: leaveStatus.find(item => item._id === "Rejected")?.count || 0,
      pending: leaveStatus.find(item => item._id === "Pending")?.count || 0,
    };

    // Respond with the summarized data
    return res.status(200).json({
      success: true,
      totalEmployees,
      totalDepartments,
      totalSalary: totalSalaries[0]?.totalSalary || 0,
      leaveSummary
    });
  } catch (error) {
    // Log and respond with an error message if any exception occurs
    console.error("Error in getting summary:", error.message);
    return res.status(500).json({ success: false, error: "Dashboard summary error" });
  }
};

export { getSummary };
