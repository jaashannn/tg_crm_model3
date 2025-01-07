import express from "express";
import authMiddleware from "../middleware/authMiddlware.js";
import { createMeeting, getMeetings } from "../controllers/meetingController.js";

const router = express.Router();

// Fetch all meetings
router.get('/', authMiddleware, getMeetings);

// Fetch a single meeting by ID
// router.get('/:id', authMiddleware, getMeeting);

// Add a new meeting
router.post('/add', authMiddleware, createMeeting);

// Update an existing meeting
// router.put('/:id', authMiddleware, updateMeeting);

// Assign a meeting to a lead or employee
// router.put('/assign/:id', authMiddleware, assignMeeting);

export default router;
