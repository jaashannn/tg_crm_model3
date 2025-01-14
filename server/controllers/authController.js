import jwt from "jsonwebtoken";
import User from "../models/User.js";
import bcrypt from "bcrypt";

// Login function to authenticate a user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, error: "User Not Found" });
    }

    // Compare provided password with stored password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, error: "Wrong Password" });
    }

    // Generate JWT token with user id and role, set expiration
    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_KEY,
      { expiresIn: "10d" }
    );

    // Send back the success response with the token and user details
    return res.status(200).json({
      success: true,
      token,
      user: { _id: user._id, name: user.name, role: user.role },
    });
  } catch (error) {
    // Log and send the error in case of an exception
    console.error("Login error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Verify function to check token validity and user
const verify = (req, res) => {
  // Send user details in the response if verification succeeds
  return res.status(200).json({ success: true, user: req.user });
};

export { login, verify };
