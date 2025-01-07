import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Employee from '../models/Employee.js';
import dotenv from 'dotenv';  
dotenv.config();

const verifyUser = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(404).json({ success: false, error: "Token Not Provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_KEY);
        if (!decoded) {
            return res.status(404).json({ success: false, error: "Token Not Valid" });
        }

        const user = await User.findById(decoded._id).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, error: "User not found" });
        }

        // Check if the user is an admin or employee
        if (user.role === 'employee') {
            const employee = await Employee.findOne({ userId: decoded._id });
            if (!employee) {
                return res.status(404).json({ success: false, error: "Employee not found" });
            }
            req.employee = employee; // Attach Employee details
        }

        req.user = user; // Attach User details
        next();
    } catch (error) {
        console.log("Error:", error.message);
        return res.status(500).json({ success: false, error: "Server error: " + error });
    }
};

export default verifyUser;
