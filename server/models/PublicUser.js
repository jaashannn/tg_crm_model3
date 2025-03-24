import mongoose from "mongoose";

const publicUserSchema = new mongoose.Schema({
    page: { type: String, required: true },
    referrer: { type: String },
    timestamp: { type: Date, default: Date.now },
    name: { type: String, default: "Guest" },
    email: { type: String },
    mobile: { type: String },
});

export default mongoose.model("PublicUser", publicUserSchema);
