import React, { useState, useEffect } from "react";
import axios from "axios";

const Note = () => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const apiUrl = import.meta.env.VITE_API_URL;

  // Fetch notes from the server
  const fetchNotes = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/notes`);
      setNotes(response.data.notes);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  // Create a new note
  const handleCreateNote = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}/api/notes`, { title, content });
      setNotes([...notes, response.data]);
      setTitle("");
      setContent("");
    } catch (error) {
      console.error("Error creating note:", error);
    }
  };

  // Delete a note
  const handleDeleteNote = async (id) => {
    try {
      await axios.delete(`${apiUrl}/api/notes/${id}`);
      setNotes(notes.filter((note) => note._id !== id));
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div className="note-app">
      <h1 className="text-2xl font-bold mb-4">Notes</h1>

      {/* Note Form */}
      <form onSubmit={handleCreateNote} className="mb-6">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="block w-full mb-2 p-2 border border-gray-300 rounded"
          required
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="block w-full mb-2 p-2 border border-gray-300 rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Note
        </button>
      </form>

      {/* Notes List */}
      <div className="notes-list">
        {notes.map((note) => (
          <div key={note._id} className="note-item border p-4 mb-2 rounded">
            <h3 className="text-xl font-semibold">{note.title}</h3>
            <p className="text-gray-700">{note.content}</p>
            <button
              onClick={() => handleDeleteNote(note._id)}
              className="text-red-500 mt-2 hover:underline"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Note;
