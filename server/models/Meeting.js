// models/Meeting.js

import mongoose from 'mongoose';

const meetingSchema = new mongoose.Schema(
  {
    // Reference to either Task or Lead depending on the role
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      required: function () {
        return this.createdBy === 'employee'; // Only required if created by employee
      },
    },
    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lead',
      required: function () {
        return this.createdBy === 'admin'; // Only required if created by admin
      },
    },
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
    },
    meetingDate: {
      type: Date,
      required: true,
    },
    meetingTime: {
      type: String,
      required: true,
    },
    agenda: {
      type: String,
      required: true,
    },
    notes: String,
    createdBy: {
      type: String,
      enum: ['admin', 'employee'],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Meeting', meetingSchema);
