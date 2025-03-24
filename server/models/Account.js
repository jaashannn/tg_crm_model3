import mongoose from "mongoose";

// Define the schema for the "Account" collection (company)
const accountSchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true }, // Name of the company
    website: { type: String, required: true }, // Company's website URL
    companyLinkedin: { type: String }, // Company's LinkedIn URL
    employeeSize: { type: Number, required: true }, // Number of employees
    revenue: { type: String, required: true }, // Revenue of the company
    industry: { type: String, required: true }, // Industry type (e.g., IT, Finance, etc.)
    addToDartboard: { type: Boolean, default: false }, // Boolean flag for Dartboard inclusion
    isTargetAccount: { type: Boolean, default: false }, // Boolean flag for target account
    leads: [{ type: String, ref: "Lead" }], // Connection with leads
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

const Account = mongoose.model("Account", accountSchema);
export default Account;
