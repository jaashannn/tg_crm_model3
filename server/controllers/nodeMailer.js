import Nodemailer from "../models/NodeMailer.js";
import nodemailer from "nodemailer";

export const sendEmail = async (req, res) => {
  const { userEmail, password, recipientEmail, subject, message } = req.body;
  console.log(req.body);

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      service: "gmail",
      auth: {
        user: userEmail, // Sender's email
        pass: password,  // Sender's email password or app password
      },
    });

    const mailOptions = {
      from: userEmail,
      to: recipientEmail,
      subject,
      text: message,
    };

    const info = await transporter.sendMail(mailOptions);

    // Save email to database
    const emailRecord = new Nodemailer({
      userEmail,
      recipientEmail,
      subject,
      message,
    });
    await emailRecord.save();

    res.status(200).json({ message: "Email sent successfully", info });
  } catch (error) {
    res.status(500).json({ message: "Email sending failed", error });
  }
};
