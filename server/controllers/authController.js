import jwt from "jsonwebtoken";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import crypto from "crypto";

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const otpStorage = {};

// Send OTP to email
const sendOtp = async (req, res) => {
  try {
    const { email, password } = req.body;
    // console.log(email, password)
    const otp = crypto.randomInt(100000, 999999).toString();

    // Store OTP in memory
    otpStorage[email] = { otp, expires: Date.now() + 300000 }; // 5 minutes expiry

    // Auto-remove OTP after expiry
    setTimeout(() => {
      delete otpStorage[email];
    }, 300000);

    // Send OTP via email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}. It is valid for 5 minutes.`,
    });

    res.status(200).json({ success: true, message: "OTP sent to email" });
  } catch (error) {
    console.error("Send OTP error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Verify OTP (unchanged)
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Check if OTP exists in memory and is valid
    if (!otpStorage[email] || otpStorage[email].expires < Date.now()) {
      return res.status(400).json({ success: false, error: "Invalid or expired OTP" });
    }

    // Compare OTP
    if (otpStorage[email].otp !== otp) {
      return res.status(400).json({ success: false, error: "Invalid OTP" });
    }

    // OTP is valid, remove it from memory
    delete otpStorage[email];

    res.status(200).json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Login function (unchanged)
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // console.log(email, password);
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, error: "User Not Found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, error: "Wrong Password" });
    }

    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_KEY,
      { expiresIn: "10d" }
    );

    res.status(200).json({
      success: true,
      token,
      user: { _id: user._id, name: user.name, role: user.role },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Verify function (unchanged)
const verify = (req, res) => {
  res.status(200).json({ success: true, user: req.user });
};

export { login, verify, sendOtp, verifyOtp };