import mongoose from 'mongoose';

// Define the schema for the "demo" collection
const demoSchema = new mongoose.Schema({
    prospectName: { type: String, required: true },
    titleLevel: { type: String, required: true },
    linkedin: { type: String, required: true },
    role: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    website: { type: String, required: true },
    budget: {
        type: String,
        enum: ['allocated', 'not allocated', 'need approval'],
        required: true
    },
    authority: { type: String },
    need: { type: String, enum: ['yes', 'no'], required: true },
    pocCriteria: {
        type: String,
        enum: ['met', 'not met', 'tbd'],
        required: true
    },
    opportunity: {
        type: String,
        enum: ['3 month', '6 month', 'no'],
        required: true
    },
    // Reference to the meeting for which this feedback is submitted
    meetingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Meeting', // Reference to the Meeting model
        required: true
    }
}, {
    timestamps: true // Automatically add createdAt and updatedAt fields
});

// Export the model
const Demo = mongoose.model('Demo', demoSchema);
export default Demo;