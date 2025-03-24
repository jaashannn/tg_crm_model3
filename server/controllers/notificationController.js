import Notification from "../models/Notification.js";
import nodemailer from "nodemailer";
import mongoose from "mongoose";
import Employee from "../models/Employee.js";
const ObjectId = mongoose.Types.ObjectId;
// Email Transporter (Use your email credentials)
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL, // Your email
        pass: process.env.EMAIL_PASSWORD, // App password
    },
});

// Send Email Notification
const sendEmailNotification = async (email, message) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: "New Notification",
            text: message,
        });
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

// Create a new Notification
export const createNotification = async (req, res) => {
    try {
        const { employeeId, message, type, email } = req.body;

        const notification = new Notification({ employeeId, message, type });
        await notification.save();

        // Send real-time notification via Socket.io
        req.io.to(employeeId.toString()).emit("newNotification", notification);

        // Send email notification (optional)
        if (email) {
            await sendEmailNotification(email, message);
        }

        res.status(201).json(notification);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

// Get all notifications for an employee
export const getNotifications = async (req, res) => {
    try {
        const { employeeId } = req.params;

        const employeeObjectId = new ObjectId(employeeId);

        const user = await Employee.findOne({ userId: employeeObjectId });

      
        // Query using the ObjectId
        const not = await Notification.find({ employeeId: user._id }).sort({ createdAt: -1 });

        res.json({success: true, data: not });

    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

// Mark a notification as read
export const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        await Notification.findByIdAndUpdate(id, { isRead: true });
        res.json({ message: "Notification marked as read" });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};
