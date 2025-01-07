// import CallLog from "../models/CallLog";
import CallLog from "../models/CallLog.js";

export const createCallLog = async (req, res) => {
    try {
        const { leadId, callDuration, callNotes } = req.body;
        console.log(req.body, 'call log')
        console.log(req.user.id, "userid")

        // if (!leadId || !callDuration || !callNotes) {
        //     return res.status(400).json({ success: false, message: "All fields are required." });
        // }

        // console.log("leadId:", leadId);
        // console.log("callDuration:", callDuration);
        // console.log("callNotes:", callNotes);
        // console.log("calledBy:", req.user.id);


        const newCallLog = new CallLog({
            leadId,
            callDuration,
            callNotes,
            calledBy: req.user.id, // Assuming user info comes from the auth middleware
        });

        console.log(newCallLog, "newclallog")
        await newCallLog.save();

        res.status(201).json({ success: true, message: "Call log created successfully." });
    } catch (error) {
        console.error("Error creating call log:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
