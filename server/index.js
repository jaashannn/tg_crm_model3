import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import connectToDatabase from "./db/db.js";
import Message from "./models/UserChat.js"; // Import the Message model
import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

// Import Routes
import authRouter from "./routes/auth.js";
import departmentRouter from "./routes/department.js";
import employeeRouter from "./routes/employee.js";
import salaryRouter from "./routes/salary.js";
import leaveRouter from "./routes/leave.js";
import settingRouter from "./routes/setting.js";
import dashboardRouter from "./routes/dashboard.js";
import leadRouter from "./routes/lead.js";
import taskRouter from "./routes/task.js";
import meetingRouter from "./routes/meeting.js";
import noteRouter from "./routes/note.js";
import callLogRouter from "./routes/callLog.js";
import demoRoutes from "./routes/demo.js";
import accountRouter from "./routes/account.js";
import dealRouter from "./routes/deal.js";
import dartboardRouter from "./routes/dartboard.js";
import stripeRouter from "./routes/stripe.js";
import trackingRouter from "./routes/tracking.js";
import userMailRoutes from "./routes/userMail.js";
import emailRoutes from "./routes/email.js";
import notificationRoutes from "./routes/notification.js";
import chatRouter from "./routes/userChat.js"; // Import chat routes

connectToDatabase();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use("/uploads", express.static("public/uploads")); // Serve static files

// Attach Socket.io to requests
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Route prefixes
app.use("/api/auth", authRouter);
app.use("/api/department", departmentRouter);
app.use("/api/employee", employeeRouter);
app.use("/api/salary", salaryRouter);
app.use("/api/leave", leaveRouter);
app.use("/api/setting", settingRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/lead", leadRouter);
app.use("/api/task", taskRouter);
app.use("/api/meeting", meetingRouter);
app.use("/api/note", noteRouter);
app.use("/api/calllog", callLogRouter);
app.use("/api/demo", demoRoutes);
app.use("/api/accounts", accountRouter);
app.use("/api/deal", dealRouter);
app.use("/api/dartboard", dartboardRouter);
app.use("/api/stripe", stripeRouter);
app.use("/api/tracking", trackingRouter);
app.use("/api/userMail", userMailRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/notification", notificationRoutes);
app.use("/api/chat", chatRouter); // Add chat routes

// Store active users and their sockets
const activeUsers = new Map(); // Map<userId, socket>

// Heartbeat interval (e.g., 30 seconds)
const HEARTBEAT_INTERVAL = 30000;
const heartbeatTimeouts = new Map();

// Function to handle heartbeat
const setupHeartbeat = (socket, userId) => {
  if (heartbeatTimeouts.has(userId)) {
    clearTimeout(heartbeatTimeouts.get(userId));
  }

  // Set a new timeout for the user
  const timeout = setTimeout(() => {
    // console.log(`User ${userId} heartbeat timeout`);
    activeUsers.delete(userId);
    heartbeatTimeouts.delete(userId);
    socket.disconnect(true); // Force disconnect
  }, HEARTBEAT_INTERVAL);

  heartbeatTimeouts.set(userId, timeout);
};

io.on("connect", (socket) => {
  // console.log("User connected:", socket.id);

  // Handle login event
  socket.on("login", (userId) => {
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      console.error("Invalid userId provided for login:", userId);
      socket.emit("error", { message: "Invalid userId" });
      return;
    }

    activeUsers.set(userId, socket); // Store socket directly
    // console.log(`User ${userId} logged in`);
    // console.log("Active users:", Array.from(activeUsers.keys()));

    // Setup heartbeat for the user
    setupHeartbeat(socket, userId);

    // Listen for heartbeat pings from the client
    socket.on("heartbeat", () => {
      // console.log(`Received heartbeat from user ${userId}`);
      setupHeartbeat(socket, userId);
    });
  });

  // Handle sendMessage event
  socket.on("sendMessage", async (data) => {
    const { senderId, receiverId, message } = data;
    // console.log("Received sendMessage event:", data);

    // Validate input
    if (!senderId || !receiverId || !message) {
      // console.error("Invalid message data:", data);
      socket.emit("error", { message: "Invalid message data" });
      return;
    }

    if (senderId === receiverId) {
      // console.log("Cannot send message to self:", senderId);
      socket.emit("error", { message: "You cannot send a message to yourself" });
      return;
    }

    try {
      // Save message to database
      const newMessage = new Message({ senderId, receiverId, message });
      await newMessage.save();
      // console.log("Message saved to database:", newMessage);

      // Prepare message data
      const messageData = {
        senderId,
        receiverId,
        message,
        timestamp: new Date().toISOString(),
      };

      // Emit message to receiver if online
      const receiverSocket = activeUsers.get(receiverId);
      if (receiverSocket) {
        receiverSocket.emit("receiveMessage", messageData);
        // console.log(`Message sent from ${senderId} to ${receiverId}: ${message}`);
      } else {
        // console.log(`User ${receiverId} is offline`);
        socket.emit("offlineUser", { receiverId });
      }

      // Confirm message sent to sender
      socket.emit("messageSent", messageData);
    } catch (error) {
      // console.error("Error saving or sending message:", error);
      socket.emit("error", { message: "Failed to send message" });
    }
  });

  // Handle disconnect event
  socket.on("disconnect", () => {
    // console.log("User disconnected:", socket.id);
    for (const [userId, userSocket] of activeUsers.entries()) {
      if (userSocket === socket) {
        activeUsers.delete(userId);
        heartbeatTimeouts.delete(userId);
        console.log(`User ${userId} logged out`);
        break;
      }
    }
    // console.log("Active users after disconnect:", Array.from(activeUsers.keys()));
  });
});

// Start Server
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});