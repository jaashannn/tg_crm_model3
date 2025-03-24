import mongoose from "mongoose";

const UserMailSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  smtp: {
    host: { type: String, required: true },
    port: { type: Number, required: true },
    user: { type: String, required: true },
    pass: { type: String, required: true }, // Store securely in production
  },
});

const UserMail = mongoose.model("UserMail", UserMailSchema);
export default UserMail;
