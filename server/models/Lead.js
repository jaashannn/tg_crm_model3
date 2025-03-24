import mongoose from "mongoose";
import { Schema } from "mongoose";

const leadSchema = new Schema({
  leadId: { type: String, required: true, unique: true },
  name: { type: String },
  email: { type: String, required: true, unique: true },
  phone: { type: String }, // Primary phone
  phone1: { type: String }, // Additional phone 1
  phone2: { type: String }, // Additional phone 2
  company: { type: String },
  designation: { type: String }, // Job title
  country: { type: String }, // Lead's country
  timeZone: { type: String },
  linkedin:{type: String}, // Lead's time zone
  account: { type: Schema.Types.ObjectId, ref: "Account", default: null }, // Account reference
  source: { type: String},
  status: { type: String, enum: ["Unassigned", "Assigned", "In Progress", "Closed"], default: "Unassigned" },
  assignedTo: { type: Schema.Types.ObjectId, ref: "Employee", default: null },
  role: { 
    type: String, 
    enum: ["Decision Maker", "Champion", "Influencer", "Evaluator"], 
    default: "Evaluator" 
  }, // Role in decision-making
  notes: { type: String },
  meetingBooked: { type: Boolean, default: false }, // Track if a meeting is booked
  fetchedFromWebsiteAt: { type: Date, default: Date.now }, // Timestamp when the lead was fetched
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Lead = mongoose.model("Lead", leadSchema);
export default Lead;

