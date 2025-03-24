import Demo from '../models/Demo.js'; // Adjust path based on your folder structure
import mongoose from 'mongoose';

// Add a new demo entry
export const addDemo = async (req, res) => {
    try {
        const demoData = req.body;
        // console.log(demoData);
        const newDemo = new Demo(demoData);
        await newDemo.save();
        return res.status(200).json({ success: true, demo: newDemo });
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: error.message });
    }
};


export const getMeetingFeedback = async (req, res) => {
    try {
        // console.log("Request Params:", req.params); // Log request params
        const { meetingId } = req.params;
        // console.log("Meeting ID:", meetingId); // Log the meeting ID
        // Convert meetingId to ObjectId
        const objectIdMeetingId = new mongoose.Types.ObjectId(meetingId);

        // Find feedback associated with the meeting in the Demo model
        const feedback = await Demo.findOne({ meetingId: objectIdMeetingId });
        
        // console.log("Feedback from DB:", feedback); // Log the feedback found

        if (!feedback) {
            return res.status(404).json({ success: false, message: "No feedback found for this meeting." });
        }

        res.status(200).json({ success: true, feedback });
    } catch (error) {
        console.error("Error in getMeetingFeedback:", error); // Log the error
        res.status(500).json({ success: false, message: "Error fetching feedback.", error: error.message });
    }
};
// Get demo statistics
// export const getDemoStats = async (req, res) => {
//     try {
//         const totalDemos = await Demo.countDocuments({});
//         const completedDemos = await Demo.countDocuments({ opportunity: "met" });
//         const dealsMade = await Demo.countDocuments({ budgetAuthority: "yes" });

//         res.status(200).json({
//             totalDemos,
//             completedDemos,
//             dealsMade,
//         });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };
