import mongoose from "mongoose";
import { Schema } from "mongoose";

const taskSchema = new Schema({
  taskId: { type: String, required: true, unique: true },
  lead: { type: Schema.Types.ObjectId, ref: "Lead", required: true },
  employee: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
  assignedTo: { type: Schema.Types.ObjectId, ref: "Employee" }, // Add this line if you need `assignedTo`
  status: { type: String, enum: ["Pending", "In Progress", "Completed"], default: "Pending" },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});


const Task = mongoose.model("Task", taskSchema);
export default Task;
