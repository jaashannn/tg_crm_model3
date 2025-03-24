import Department from "../models/Department.js";

// Fetch all departments from the database
const getDepartments = async (req, res) => {
    try {
        const departments = await Department.find(); // Retrieve all departments
        return res.status(200).json({success: true, departments});
    } catch (error) {
        // Log error for debugging and return a generic server error response
        console.error("Error fetching departments:", error);
        return res.status(500).json({success: false, error: "Server error while fetching departments"});
    }
};

// Add a new department to the database
const addDepartment = async (req, res) => {
    try {
        const {dep_name, description} = req.body; // Destructure required fields from the request body
        const newDep = new Department({ dep_name, description }); // Create new department instance

        // Save the new department to the database
        await newDep.save();
        return res.status(200).json({success: true, department: newDep});
    } catch (error) {
        // Log error and return a server error response
        console.error("Error adding department:", error);
        return res.status(500).json({success: false, error: "Server error while adding department"});
    }
};

// Fetch a single department by its ID
const getDepartment = async (req, res) => {
    try {
        const {id} = req.params; // Extract department ID from the URL parameters
        const department = await Department.findById(id); // Find department by its ID

        if (!department) {
            // Return 404 if department is not found
            return res.status(404).json({success: false, error: "Department not found"});
        }

        return res.status(200).json({success: true, department});
    } catch (error) {
        // Log error and return a server error response
        console.error("Error fetching department:", error);
        return res.status(500).json({success: false, error: "Server error while fetching department"});
    }
};

// Update an existing department by its ID
const updateDepartment = async (req, res) => {
    try {
        const {id} = req.params; // Extract department ID from the URL parameters
        const {dep_name, description} = req.body; // Extract updated data from the request body

        // Update department and return the updated record
        const updatedDep = await Department.findByIdAndUpdate(id, {dep_name, description}, {new: true});
        
        if (!updatedDep) {
            // Return 404 if department to update is not found
            return res.status(404).json({success: false, error: "Department not found"});
        }

        return res.status(200).json({success: true, updatedDep});
    } catch (error) {
        // Log error and return a server error response
        console.error("Error updating department:", error);
        return res.status(500).json({success: false, error: "Server error while updating department"});
    }
};

// Delete a department by its ID
const deleteDepartment = async (req, res) => {
    try {
        const {id} = req.params; // Extract department ID from the URL parameters
        const departmentToDelete = await Department.findById(id); // Find the department by ID

        if (!departmentToDelete) {
            // Return 404 if department is not found for deletion
            return res.status(404).json({success: false, error: "Department not found"});
        }

        // Delete the department
        await departmentToDelete.deleteOne();
        return res.status(200).json({success: true, department: departmentToDelete});
    } catch (error) {
        // Log error and return a server error response
        console.error("Error deleting department:", error);
        return res.status(500).json({success: false, error: "Server error while deleting department"});
    }
}

export {addDepartment, getDepartments, getDepartment, updateDepartment, deleteDepartment};
