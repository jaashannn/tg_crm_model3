import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  FaPhone,
  FaEnvelope,
  FaUserPlus,
  FaStickyNote,
  FaPhoneAlt,
} from "react-icons/fa";
import Loader from "../Loading/Loader";
import toast, { Toaster } from "react-hot-toast";

const ViewTask = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isCallLogModalOpen, setIsCallLogModalOpen] = useState(false);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [callDuration, setCallDuration] = useState("");
  const [callNotes, setCallNotes] = useState("");
  const [isSavingNote, setIsSavingNote] = useState(false); // For disabling the save button
  const [isSavingCallLog, setIsSavingCallLog] = useState(false); // For disabling the save button
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/task/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (response.data.success) {
          setTask(response.data.task);
        }
      } catch (error) {
        toast.error(
          error.response?.data?.error || "Failed to fetch task details."
        );
      }
    };

    fetchTask();
  }, [id]);

  const handleAddNote = async () => {
    if (!noteTitle || !noteContent) {
      toast.error("Please fill out all fields for the note.");
      return;
    }

    const newNote = { leadId: id, title: noteTitle, content: noteContent };

    // Optimistic UI update
    setTask((prevTask) => ({
      ...prevTask,
      notes: [...prevTask.notes, newNote], // Assuming task has a notes field
    }));

    setIsSavingNote(true);
    try {
      const response = await axios.post(
        `${apiUrl}/api/note/add`,
        newNote,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Note added successfully!");
        setNoteTitle("");
        setNoteContent("");
        setIsNoteModalOpen(false);
      }
    } catch (error) {
      toast.error("Failed to save the note.");
      // Revert optimistic update on failure
      setTask((prevTask) => ({
        ...prevTask,
        notes: prevTask.notes.filter((note) => note.title !== noteTitle),
      }));
    } finally {
      setIsSavingNote(false);
    }
  };

  const handleAddCallLog = async () => {
    if (!callDuration || !callNotes) {
      toast.error("Please fill out all fields for the call log.");
      return;
    }

    const newCallLog = { leadId: id, callDuration, callNotes };

    // Optimistic UI update
    setTask((prevTask) => ({
      ...prevTask,
      callLogs: [...prevTask.callLogs, newCallLog], // Assuming task has callLogs field
    }));

    setIsSavingCallLog(true);
    try {
      const response = await axios.post(
        `${apiUrl}/api/calllog/add`,
        newCallLog,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Call log added successfully!");
        setCallDuration("");
        setCallNotes("");
        setIsCallLogModalOpen(false);
      }
    } catch (error) {
      toast.error("Failed to save the call log.");
      // Revert optimistic update on failure
      setTask((prevTask) => ({
        ...prevTask,
        callLogs: prevTask.callLogs.filter((log) => log.callDuration !== callDuration),
      }));
    } finally {
      setIsSavingCallLog(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      {!task ? (
        <Loader />
      ) : (
        <div className="min-h-screen bg-gray-100 px-10 py-8">
          {/* Header */}
          <div className="border-b border-gray-300 pb-6 mb-8">
            <h1 className="text-4xl font-bold text-gray-800">{task.name}</h1>
            <p className="text-sm text-gray-600">{task.email}</p>
          </div>

          {/* Content */}
          <div className="grid grid-cols-12 gap-8">
            {/* Task Info */}
            <div className="col-span-12 lg:col-span-4 bg-white rounded-md shadow-md p-6">
              <h2 className="text-xl font-bold border-b pb-2">Task Info</h2>
              <p className="mt-4">
                <span className="font-semibold">Phone:</span> {task.phone}
              </p>
              <p className="mt-4">
                <span className="font-semibold">Company:</span> {task.company}
              </p>

              {/* Actions */}
              <h3 className="text-lg font-bold mt-6">Actions</h3>
              <div className="flex flex-wrap gap-4 mt-4">
                <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600">
                  <FaPhone className="mr-2" /> Call
                </button>
                <button className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md shadow-md hover:bg-green-600">
                  <FaEnvelope className="mr-2" /> Email
                </button>
                <button className="flex items-center px-4 py-2 bg-purple-500 text-white rounded-md shadow-md hover:bg-purple-600">
                  <FaUserPlus className="mr-2" /> Assign
                </button>
                <button
                  onClick={() => setIsNoteModalOpen(true)}
                  className="flex items-center px-4 py-2 bg-yellow-500 text-white rounded-md shadow-md hover:bg-yellow-600"
                >
                  <FaStickyNote className="mr-2" /> Notes
                </button>
                <button
                  onClick={() => setIsCallLogModalOpen(true)}
                  className="flex items-center px-4 py-2 bg-teal-500 text-white rounded-md shadow-md hover:bg-teal-600"
                >
                  <FaPhoneAlt className="mr-2" /> Call Log
                </button>
              </div>
            </div>
          </div>

          {/* Modals */}
          {isNoteModalOpen && (
            <Modal
              title="Add Note"
              onClose={() => setIsNoteModalOpen(false)}
              onSave={handleAddNote}
              content={
                <>
                  <InputField
                    label="Title"
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                  />
                  <TextareaField
                    label="Content"
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                  />
                </>
              }
              isSaving={isSavingNote}
            />
          )}

          {isCallLogModalOpen && (
            <Modal
              title="Add Call Log"
              onClose={() => setIsCallLogModalOpen(false)}
              onSave={handleAddCallLog}
              content={
                <>
                  <InputField
                    label="Call Duration (mins)"
                    value={callDuration}
                    onChange={(e) => setCallDuration(e.target.value)}
                  />
                  <TextareaField
                    label="Call Notes"
                    value={callNotes}
                    onChange={(e) => setCallNotes(e.target.value)}
                  />
                </>
              }
              isSaving={isSavingCallLog}
            />
          )}
        </div>
      )}
    </>
  );
};

// Reusable Components
const Modal = ({ title, onClose, onSave, content, isSaving }) => (
  <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
    <div className="bg-white rounded-md shadow-lg w-96 p-6">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      {content}
      <div className="flex justify-end mt-4 space-x-4">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          disabled={isSaving}
          className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isSaving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  </div>
);

const InputField = ({ label, value, onChange }) => (
  <div className="mb-4">
    <label className="block text-sm font-bold">{label}</label>
    <input
      type="text"
      value={value}
      onChange={onChange}
      className="w-full border border-gray-300 rounded-md p-2"
    />
  </div>
);

const TextareaField = ({ label, value, onChange }) => (
  <div className="mb-4">
    <label className="block text-sm font-bold">{label}</label>
    <textarea
      value={value}
      onChange={onChange}
      className="w-full border border-gray-300 rounded-md p-2"
      rows="4"
    />
  </div>
);

export default ViewTask;
