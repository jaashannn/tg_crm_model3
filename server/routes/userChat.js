import express from "express";
import { getChatHistory } from "../controllers/userChatController.js";

const router = express.Router();

// Route to fetch chat history
router.get("/messages/:senderId/:receiverId", getChatHistory);

export default router;