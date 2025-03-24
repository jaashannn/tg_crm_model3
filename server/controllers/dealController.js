import Deal from '../models/Deal.js';

// Add a new deal qualification
export const addDeal = async (req, res) => {
  try {
    const { accountId, stage, ...dealData } = req.body;

    // console.log("Received Data:", req.body); // Debugging: Log request data

    // if (!value) {
    //   return res.status(400).json({ success: false, message: "Value is required." });
    // }

    const validStages = [
      "Demo Scheduled",
      "Demo Done",
      "Opportunity",
      "POC",
      "Negotiation",
      "Closed Won",
      "Closed Lost",
      "Nurture",
    ];
    const finalStage = validStages.includes(stage) ? stage : "Demo Scheduled";

    const newDeal = new Deal({ 
      ...dealData, 
      accountId,
      stage: finalStage 
    });

    // console.log("Saving Deal:", newDeal); // Debugging: Log before saving

    await newDeal.save();
    res.status(201).json({ success: true, deal: newDeal });
  } catch (error) {
    console.error("Error creating deal:", error); // Log full error
    res.status(400).json({ success: false, message: error.message });
  }
};




export const getDeals = async (req, res) => {
  try {
    const deals = await Deal.find();
    res.status(200).json({ success: true, deals });
  }
  catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

// Get deals for a specific account
export const getDeal = async (req, res) => {
  try {
    const { id } = req.params;
    // Extract accountId from query parameters
    const deals = await Deal.find({ _id: id }); 
    // console.log(deals)    
    res.status(200).json({ success: true, deals });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};


// Update an existing deal
// PATCH /api/deal/:id
export const updateDealStage = async (req, res) => {
  try {
    const { id } = req.params;
    const { stage } = req.body;
  //  console.log("Stage:", stage)
    const deal = await Deal.findByIdAndUpdate(
      id,
      { stage },
      { new: true }
    );

    if (!deal) {
      return res.status(404).json({ success: false, message: 'Deal not found' });
    }

    res.status(200).json({ success: true, deal });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete a deal
export const deleteDeal = async (req, res) => {
  try {
    const { id } = req.params; // Extract deal ID from URL parameters
    await Deal.findByIdAndDelete(id); // Delete deal
    res.status(200).json({ success: true, message: 'Deal deleted successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};