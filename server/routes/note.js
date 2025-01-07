import express from "express";
import authMiddleware from '../middleware/authMiddlware.js';
import {
  getNotes,
//   getNote,
  createNote,
//   updateNote,
  deleteNote,
} from "../controllers/noteController.js";

const router = express.Router();

// Fetch all notes
router.get('/', authMiddleware, getNotes);

// Fetch a single note by ID
// router.get("/:id", authMiddleware, getNote);

// Create a new note
router.post('/add', authMiddleware, createNote);

// Update an existing note
// router.put("/:id", authMiddleware, updateNote);

// Delete a note
router.delete('/:id', authMiddleware, deleteNote);

export default router;
