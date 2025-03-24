import TrackingData from "../models/Tracking.js"; // Import your MongoDB model

// Controller to handle page visit tracking
export const trackPageVisit = async (req, res) => {
  try {
    const { page, referrer, timestamp, userAgent, frontendIP } = req.body;

    console.log("Request Body:", req.body);

    // Get IP from request headers (backend IP)
    const backendIP = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    // Validate the incoming data
    if (!page || !timestamp) {
      return res.status(400).json({ success: false, message: "Page and timestamp are required" });
    }

    // Save the tracking data to the database
    const trackingData = new TrackingData({ 
      page, 
      referrer, 
      timestamp, 
      userAgent, 
      frontendIP, // Public IP from frontend
      backendIP  // Real IP from request headers
    });

    await trackingData.save();

    res.status(200).json({ success: true, message: "Tracking data saved successfully" });
  } catch (error) {
    console.error("Error saving tracking data:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
