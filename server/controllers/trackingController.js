import TrackingData from "../models/Tracking.js"; // Import your MongoDB model

// Controller to handle page visit tracking
export const trackPageVisit = async (req, res) => {
  try {
    const { page, referrer, timestamp, userAgent } = req.body;

    // Validate the incoming data
    if (!page || !timestamp) {
      return res.status(400).json({ success: false, message: "Page and timestamp are required" });
    }

    // Save the tracking data to the database
    const trackingData = new TrackingData({ page, referrer, timestamp, userAgent });
    await trackingData.save();

    res.status(200).json({ success: true, message: "Tracking data saved successfully" });
  } catch (error) {
    console.error("Error saving tracking data:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
