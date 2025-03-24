import multer from "multer";
import Employee from "../models/Employee.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import path from "path";
import Department from "../models/Department.js";

// Setup multer for file storage and image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads"); // Specify upload directory
  },
  filename: (req, file, cb) => {
    // Use a timestamp to ensure unique file names
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Add a new employee to the system, ensuring the user is not already registered
const addEmployee = async (req, res) => {
  try {
    const { name, email, employeeId, dob, gender, maritalStatus, designation, department, salary, password, role } = req.body;

    // Check if the user is already registered
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ success: false, error: "User already registered" });
    }

    // Hash the password before storing
    const hashPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      name,
      email,
      password: hashPassword,
      role,
      profileImage: req.file ? req.file.filename : "",
    });
    const savedUser = await newUser.save();

    // Create a new employee linked to the created user
    const newEmployee = new Employee({
      userId: savedUser._id,
      name,
      email,
      employeeId,
      dob,
      gender,
      maritalStatus,
      designation,
      department,
      salary,
    });

    await newEmployee.save();
    return res.status(200).json({ success: true, message: "Employee created successfully" });
  } catch (error) {
    // Log the error and return a generic server error message
    console.error("Error in adding employee:", error);
    return res.status(500).json({ success: false, error: "Server error while adding employee" });
  }
};

// Fetch all employees with related user and department data
const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find()
      .populate("userId", { password: 0 }) // Exclude password in the response
      .populate("department");

    return res.status(200).json({ success: true, employees });
  } catch (error) {
    console.error("Error fetching employees:", error);
    return res.status(500).json({ success: false, error: "Error fetching employees" });
  }
};

// Fetch a single employee by ID, including user and department data
const getEmployee = async (req, res) => {
  const { id } = req.params;
  try {
    let employee = await Employee.findById(id)
      .populate("userId", { password: 0 })
      .populate("department");

    // If the employee is not found by ID, attempt to find by userId
    if (!employee) {
      employee = await Employee.findOne({ userId: id })
        .populate("userId", { password: 0 })
        .populate("department");
    }

    return res.status(200).json({ success: true, employee });
  } catch (error) {
    console.error("Error fetching employee:", error);
    return res.status(500).json({ success: false, error: "Error fetching employee" });
  }
};

// Update an employee's details (including related user data)
const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, maritalStatus, designation, department, salary } = req.body;

    // Find the employee by ID
    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({ success: false, error: "Employee not found" });
    }

    // Find the user associated with the employee
    const user = await User.findById(employee.userId);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    // Update user and employee details
    const updatedUser = await User.findByIdAndUpdate(employee.userId, { name }, { new: true });
    const updatedEmployee = await Employee.findByIdAndUpdate(id, { maritalStatus, designation, salary, department }, { new: true });

    if (!updatedUser || !updatedEmployee) {
      return res.status(404).json({ success: false, error: "Error updating employee" });
    }

    return res.status(200).json({ success: true, message: "Employee updated successfully" });
  } catch (error) {
    console.error("Error updating employee:", error);
    return res.status(500).json({ success: false, error: "Error updating employee" });
  }
};

// Fetch employees by department ID
const fetchEmployeesByDepId = async (req, res) => {
  const { id } = req.params;
  try {
    const employees = await Employee.find({ department: id });
    return res.status(200).json({ success: true, employees });
  } catch (error) {
    console.error("Error fetching employees by department:", error);
    return res.status(500).json({ success: false, error: "Error fetching employees by department" });
  }
}

export { addEmployee, upload, getEmployees, getEmployee, updateEmployee, fetchEmployeesByDepId };
