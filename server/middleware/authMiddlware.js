import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Employee from '../models/Employee.js';
import dotenv from 'dotenv';  

dotenv.config();

/**
 * Middleware to verify user authentication and authorization.
 * It checks the token, decodes it, and attaches the user or employee to the request object.
 * If the user is not found or if the token is invalid, it returns an error.
 */
const verifyUser = async (req, res, next) => {
    try {
        // Extract token from Authorization header
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(400).json({ success: false, error: "Token not provided" });
        }

        // Verify the token with the secret key
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        if (!decoded) {
            return res.status(401).json({ success: false, error: "Invalid token" });
        }

        // Find the user by ID and exclude password field
        const user = await User.findById(decoded._id).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, error: "User not found" });
        }

        // If the user is an employee, attach employee details
        if (user.role === 'employee') {
            const employee = await Employee.findOne({ userId: decoded._id });
            if (!employee) {
                return res.status(404).json({ success: false, error: "Employee not found" });
            }
            req.employee = employee; // Attach employee details to request
        }

        // Attach user details to request
        req.user = user;
        next();
    } catch (error) {
        console.error("Error in verifyUser middleware:", error.message);
        return res.status(500).json({ success: false, error: `Server error: ${error.message}` });
    }
};

export default verifyUser;
