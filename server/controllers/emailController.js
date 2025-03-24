import nodemailer from "nodemailer";
import UserMail from "../models/UserMail.js";

export const sendEmail = async (req, res) => {
  const { userId, to, subject, text } = req.body;

  if (!userId || !to || !subject || !text) {
    return res.status(400).json({ success: false, message: "All fields are required." });
  }

  try {
    const userMail = await UserMail.findOne({ userId });
    if (!userMail) {
      return res.status(404).json({ success: false, message: "SMTP settings not found. Please update your SMTP settings." });
    }

    const { host, port, user, pass } = userMail.smtp;

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    const mailOptions = { from: user, to, subject, text };
    const info = await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "Email sent successfully!", response: info.response });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error sending email.", error });
  }
};
