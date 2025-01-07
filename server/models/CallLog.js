import mongoose from "mongoose";

const callLogSchema = new mongoose.Schema(
  {
    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
      required: true,
    },
    callDuration: {
      type: String,  // e.g., "10 mins"
      required: true,
    },
    callNotes: {
      type: String,
      required: true,
    },
    calledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // or "Employee", depending on your schema
      required: true,
    },
    callDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const CallLog = mongoose.model("CallLog", callLogSchema);

export default CallLog;
