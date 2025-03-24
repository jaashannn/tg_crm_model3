import mongoose from "mongoose";
import { Schema } from "mongoose";

const taskSchema = new Schema(
  {
    taskId: { type: String, required: true, unique: true }, // Unique task identifier
    lead: [{ type: Schema.Types.ObjectId, ref: "Lead" }], // Supports both single and multiple leads
    employee: { type: Schema.Types.ObjectId, ref: "Employee", required: true }, // Assigned employee
    createdBy: { type: Schema.Types.ObjectId, ref: "Employee", required: true }, // Admin/employee who created the task
    assignedBy: { type: Schema.Types.ObjectId, ref: "Employee", required: true }, // Admin who assigned the task
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed", "Skipped"],
      default: "Pending",
    },
    description: { type: String, required: true }, // Detailed task description
    priority: { type: String, enum: ["Low", "Medium", "High"], default: "Low" }, // Priority level
    deadline: { type: Date, required: true }, // Deadline for the task
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt` fields
);

const Task = mongoose.model("Task", taskSchema);
export default Task;
