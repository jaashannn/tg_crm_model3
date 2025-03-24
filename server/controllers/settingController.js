// controllers/userController.js
import User from "../models/User.js";
import bcrypt from 'bcrypt';

// Change Password
const changePassword = async (req, res) => {
  try {
    const { userId, oldPassword, newPassword } = req.body;

    // Validate input fields
    if (!userId || !oldPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    // Find user by ID
    const user = await User.findById({ _id: userId });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Compare old password with stored password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Incorrect old password.' });
    }

    // Validate new password (optional, e.g., length or complexity check)
    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters long.' });
    }

    // Hash new password
    const hashPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password
    await User.findByIdAndUpdate({ _id: userId }, { password: hashPassword });

    // Respond with success
    return res.status(200).json({ success: true, message: 'Password changed successfully.' });

  } catch (error) {
    console.error('Error changing password:', error.message);
    return res.status(500).json({ success: false, message: 'Internal server error while changing password.', error: error.message });
  }
};

export { changePassword };
