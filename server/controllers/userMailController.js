import UserMail from "../models/UserMail.js";

// Save or update SMTP settings
export const updateSMTPSettings = async (req, res) => {
  const { userId, host, port, user, pass } = req.body;

  if (!userId || !host || !port || !user || !pass) {
    return res.status(400).json({ success: false, message: "All fields are required." });
  }

  try {
    let userMail = await UserMail.findOne({ userId });

    if (userMail) {
      userMail.smtp = { host, port, user, pass };
      await userMail.save();
    } else {
      userMail = new UserMail({ userId, smtp: { host, port, user, pass } });
      await userMail.save();
    }

    res.json({ success: true, message: "SMTP settings saved successfully!", userMail });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error saving SMTP settings.", error });
  }
};

// Get SMTP settings for a user
export const getSMTPSettings = async (req, res) => {
  const { userId } = req.params;

  try {
    const userMail = await UserMail.findOne({ userId });
    if (!userMail) {
      return res.status(404).json({ success: false, message: "SMTP settings not found." });
    }
    res.json({ success: true, smtp: userMail.smtp });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching SMTP settings.", error });
  }
};
