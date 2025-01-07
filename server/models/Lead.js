import mongoose from "mongoose";
import { Schema } from "mongoose";

const leadSchema = new Schema({
  leadId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  company: { type: String },
  source: { type: String, enum: ["Website", "Referral", "Advertisement", "Other"], required: true },
  status: { type: String, enum: ["Unassigned", "Assigned", "In Progress", "Closed"], default: "Unassigned" },
  assignedTo: { type: Schema.Types.ObjectId, ref: "Employee", default: null },
  notes: { type: String },
  fetchedFromWebsiteAt: { type: Date, default: Date.now }, // Timestamp when the lead was fetched
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Lead = mongoose.model("Lead", leadSchema);
export default Lead;
