import express from "express";
import authMiddleware from "../middleware/authMiddlware.js";
import { createCallLog } from "../controllers/callLogController.js";

const router = express.Router();

// Create a new call log
router.post("/add", authMiddleware, createCallLog);

export default router;
