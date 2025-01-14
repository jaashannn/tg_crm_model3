// controllers/salaryController.js
import Salary from '../models/Salary.js';
import Employee from '../models/Employee.js';

// Add Salary
const addSalary = async (req, res) => {
  try {
    const { employeeId, basicSalary, allowances, deductions, payDate } = req.body;

    // Validate required fields
    if (!employeeId || !basicSalary || !allowances || !deductions || !payDate) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    // Calculate net salary
    const totalSalary = parseInt(basicSalary) + parseInt(allowances) - parseInt(deductions);

    // Create new salary record
    const newSalary = new Salary({
      employeeId,
      basicSalary,
      allowances,
      deductions,
      netSalary: totalSalary,
      payDate
    });

    // Save the new salary record
    await newSalary.save();

    return res.status(201).json({ success: true, message: 'Salary added successfully.' });

  } catch (error) {
    console.error('Error adding salary:', error.message);
    return res.status(500).json({ success: false, message: 'Internal server error while adding salary.', error: error.message });
  }
};

// Get Salary
const getSalary = async (req, res) => {
  try {
    const { id, role } = req.params;
    let salary;

    // If the role is admin, fetch salary records for the given employee ID
    if (role === 'admin') {
      salary = await Salary.find({ employeeId: id })
        .populate('employeeId', 'name userId') // Populating 'employeeId' with relevant fields
        .select('basicSalary allowances deductions netSalary payDate'); // Select only relevant fields
    } else {
      const employee = await Employee.findOne({ userId: id });
      salary = await Salary.find({ employeeId: employee._id })
        .populate('employeeId', 'name userId')
        .select('basicSalary allowances deductions netSalary payDate');
    }

    return res.status(200).json({ success: true, salary });

  } catch (error) {
    console.error('Error fetching salary:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to fetch salary information.', error: error.message });
  }
};

export { addSalary, getSalary };
