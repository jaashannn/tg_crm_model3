import mongoose from "mongoose";
// import { Schema } from "mongoose";

const trackingSchema = new mongoose.Schema({
    page: { type: String, required: true }, // The visited page
    referrer: { type: String }, // Referrer URL
    timestamp: { type: Date, required: true }, // Visit time
    userAgent: { type: String }, // Browser's user-agent string
  });
  
  export default mongoose.model("TrackingData", trackingSchema);
  