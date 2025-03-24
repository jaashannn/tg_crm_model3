import Dartboard from '../models/Dartboard.js';
import Account from '../models/Account.js';

// Fetch all accounts
export const getAccounts = async (req, res) => {
  try {
    const accounts = await Account.find();
    res.status(200).json({ success: true, accounts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Fetch dartboard data for a specific account
export const getDartboardData = async (req, res) => {
  try {
    const { accountId } = req.params;
    // console.log("its me")
    const dartboard = await Dartboard.findOne({ account: accountId }).populate(
      'account',
      'companyName'
    );

    if (!dartboard) {
      return res.status(404).json({ success: false, message: 'Dartboard not found' });
    }

    res.status(200).json({ success: true, dartboard });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create or update dartboard data for an account
export const updateDartboardData = async (req, res) => {
  try {
    const { accountId } = req.params;
    const updatedData = req.body;

    // Find or create a dartboard entry for the account
    let dartboard = await Dartboard.findOne({ account: accountId });

    if (!dartboard) {
      // Create a new dartboard entry if it doesn't exist
      dartboard = new Dartboard({ account: accountId, ...updatedData });
    } else {
      // Update the existing dartboard entry
      Object.assign(dartboard, updatedData);
    }

    await dartboard.save();

    res.status(200).json({ success: true, dartboard });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};