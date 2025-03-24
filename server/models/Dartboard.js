import mongoose from 'mongoose';

const dartboardSchema = new mongoose.Schema({
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account', // Reference to the Account collection
    required: true,
  },
  amount: { type: String, default: '' },
  stage: { type: String, default: 'Hunting' },
  initialDiscussionDate: { type: Date, default: null },
  requirementsFinalizationDate: { type: Date, default: null },
  pocStartDate: { type: Date, default: null },
  pocEndDate: { type: Date, default: null },
  dailyTouchpoints: { type: Date, default: null },
  pocCompletionDate: { type: Date, default: null },
  budgetApprovalDate: { type: Date, default: null },
  contractSigningDate: { type: Date, default: null },
  onboardingStartDate: { type: Date, default: null },
});

export default mongoose.model('Dartboard', dartboardSchema);