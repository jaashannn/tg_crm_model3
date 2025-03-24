import mongoose from 'mongoose';

const dealSchema = new mongoose.Schema({
  accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
  title: { type: String, required: true},
  price: { type: Number, default: 0 },
  currentTools: { type: String, required: true },
  crossBrowserTesting: { type: String, required: true },
  automationPercentage: { type: String, required: true },
  testingTeam: { type: String, required: true },
  challenges: { type: String, required: true },
  ciCdChallenges: { type: String, required: true },
  goals: { type: String, required: true },
  technicalEnvironment: { type: String, required: true },
  budgetAllocated: { type: String, required: true },
  trialSuccessMetrics: { type: String, required: true },
  collaborationProcess: { type: String, required: true },
  stage: { 
    type: String, 
    enum: ["Demo Scheduled", "Demo Done", "Opportunity", "POC", "Negotiation", "Closed Won", "Closed Lost", "Nurture"], 
    required: true, 
    default: "Demo Scheduled" // Set default stage
  }
}, { timestamps: true });

const Deal = mongoose.model('Deal', dealSchema);

export default Deal;
