import PublicUser from "../models/PublicUser.js";

export const trackPublicUser = async (req, res) => {
    try {
        const publicUserData = new PublicUser(req.body);
        await publicUserData.save();
        res.status(200).json({ message: "Public user tracking data saved successfully" });
    } catch (error) {
        console.error("Error saving tracking data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
