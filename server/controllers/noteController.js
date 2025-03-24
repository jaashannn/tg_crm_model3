// controllers/noteController.js
import Note from "../models/Note.js";

// Create a note
export const createNote = async (req, res) => {
  try {
    const { leadId, title, content } = req.body;

    // Validate required fields
    if (!leadId || !title || !content) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    // Create a new note
    const newNote = new Note({
      leadId,
      title,
      content,
      createdBy: req.user.id, // Assuming you have user info from auth middleware
    });

    // Save the note
    await newNote.save();

    return res.status(201).json({ success: true, message: 'Note created successfully.', note: newNote });
  } catch (error) {
    console.error('Error creating note:', error.message);
    return res.status(500).json({ success: false, message: 'Internal server error while creating the note.', error: error.message });
  }
};
export const getNotesByLeadId = async (req, res) => {
  try {
    const { id } = req.params;
    // console.log('leadId:', id);

    // Validate required field
    if (!id) {
      return res.status(400).json({ success: false, message: 'Lead ID is required.' });
    }

    // Fetch notes for the given leadId
    const notes = await Note.find({ leadId: id }); // Assuming you want to include creator info
    // console.log('Notes:', notes);
    // Check if notes were found
    if (!notes || notes.length === 0) {
      return res.status(404).json({ success: false, message: 'No notes found for the provided lead ID.' });
    }

    return res.status(200).json({ success: true, message: 'Notes fetched successfully.', notes });
  } catch (error) {
    console.error('Error fetching notes:', error.message);
    return res.status(500).json({ success: false, message: 'Internal server error while fetching notes.', error: error.message });
  }
};

// Get all notes
export const getNotes = async (req, res) => {
  try {
    const notes = await Note.find().populate('leadId', 'name'); // Populate leadId with specific fields (e.g., 'name')

    console.log('Notes:', notes);
    return res.status(200).json({ success: true, notes });
  } catch (error) {
    console.error('Error fetching notes:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to fetch notes.', error: error.message });
  }
};

// Delete a note
export const deleteNote = async (req, res) => {
  const { id } = req.params;

  try {
    const note = await Note.findByIdAndDelete(id);

    // Handle case where note is not found
    if (!note) {
      return res.status(404).json({ success: false, message: "Note not found." });
    }

    return res.status(200).json({ success: true, message: "Note deleted successfully." });
  } catch (error) {
    console.error('Error deleting note:', error.message);
    return res.status(500).json({ success: false, message: "Failed to delete note.", error: error.message });
  }
};
