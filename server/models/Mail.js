import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Hashed Password
  verified: { type: Boolean, default: false },
});

const Mail =  mongoose.model("Mail", userSchema);
export default Mail;
