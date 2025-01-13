import mongoose from 'mongoose';

const meetingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    lead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lead',
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
    },
    meetingDate: {
      type: String,
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
    notes: {
      type: String,
    },
    createdBy: {
      type: String,
      enum: ['admin', 'employee'],
      required: true,
    },
  },
  { timestamps: true }
);

const Meeting = mongoose.model('Meeting', meetingSchema);

export default Meeting;
