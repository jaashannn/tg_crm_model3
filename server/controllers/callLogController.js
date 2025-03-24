import CallLog from "../models/CallLog.js";
import mongoose from "mongoose";

// Controller to create a new call log
export const createCallLog = async (req, res) => {
  try {
    const { leadId, callDuration, callNotes } = req.body;

    // Check if the required fields are provided
    if (!leadId || !callDuration || !callNotes) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    // Create a new call log entry
    const newCallLog = new CallLog({
      leadId,
      callDuration,
      callNotes,
      calledBy: req.user.id, // The user ID comes from the authentication middleware
    });

    // Save the call log to the database
    await newCallLog.save();

    // Respond with a success message
    res.status(201).json({ success: true, message: "Call log created successfully." });
  } catch (error) {
    // Log and respond with error message if an exception occurs
    console.error("Error creating call log:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


// Controller to fetch call logs for a specific lead
export const getCallLogsByLeadId = async (req, res) => {
  try {
    const { leadId } = req.params;

    // Log the requested leadId
    console.log("Requested leadId:", leadId);

    // Convert leadId to ObjectId
    const objectId = new mongoose.Types.ObjectId(leadId);

    // Fetch call logs for the specified lead
    const callLogs = await CallLog.find({ leadId: objectId });

    // Log the fetched call logs
    console.log("Fetched call logs:", callLogs);

    // Respond with the call logs
    res.status(200).json({ success: true, callLogs });
  } catch (error) {
    // Log and respond with error message if an exception occurs
    console.error("Error fetching call logs:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};