import express from "express";
import authMiddleware from "../middleware/authMiddlware.js";
import { createCallLog,getCallLogsByLeadId } from "../controllers/callLogController.js";

const router = express.Router();

// Create a new call log
router.post("/add", authMiddleware, createCallLog);
router.get("/:id", authMiddleware, getCallLogsByLeadId)

export default router;
