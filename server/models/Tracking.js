import mongoose from "mongoose";

const trackingSchema = new mongoose.Schema({
    page: { type: String }, // The visited page
    referrer: { type: String }, // Referrer URL
    timestamp: { type: Date }, // Visit time
    userAgent: { type: String }, // Browser's user-agent string
    frontendIP: { type: String }, // Public IP (from frontend API)
    // backendIP: { type: String }  // Real IP (from backend request headers)
});

export default mongoose.model("TrackingData", trackingSchema);
