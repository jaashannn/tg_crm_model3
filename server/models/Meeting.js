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
    assignedTo: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true,
      },
    ],
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
    },
    notes: {
      type: String,
    },
    createdBy: {
       type: mongoose.Schema.Types.ObjectId,
       ref: "User",
        required: true ,
    },
    status: {
      type: String,
      enum: ['completed', 'pending', 'cancelled', 'no show', 'rescheduled', 'Null'],
      default: 'Null',
    },
  },
  { timestamps: true }
);

const Meeting = mongoose.model('Meeting', meetingSchema);

export default Meeting;
