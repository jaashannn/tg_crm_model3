import Note from "../models/Note.js";

export const createNote = async (req, res) => {
  try {
    const { leadId, title, content } = req.body;
    // console.log(req.body);

    if (!leadId || !title || !content) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    const newNote = new Note({
      leadId,
      title,
      content,
      createdBy: req.user.id, // Assuming you have user info from auth middleware
    });

    await newNote.save();

    res.status(201).json({ success: true, message: 'Note created successfully.' });
  } catch (error) {
    console.error('Error creating note:', error.message);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

// Get all notes
export const getNotes = async (req, res) => {
  try {
    const notes = await Note.find();
    res.status(200).json({ success: true, notes });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch notes." });
  }
};



// Delete a note
export const deleteNote = async (req, res) => {
  const { id } = req.params;
  try {
    const note = await Note.findByIdAndDelete(id);
    if (!note) return res.status(404).json({ error: "Note not found." });
    res.status(200).json({ success: true, message: "Note deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete note." });
  }
};
