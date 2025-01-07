import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  FaPhone,
  FaEnvelope,
  FaUserPlus,
  FaBan,
  FaTrash,
  FaStickyNote,
  FaRegPaperPlane,
} from "react-icons/fa";

const ViewLead = () => {
  const { id } = useParams();
  const [lead, setLead] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isCallLogModalOpen, setIsCallLogModalOpen] = useState(false);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [callDuration, setCallDuration] = useState("");
  const [callNotes, setCallNotes] = useState("");

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchLead = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/api/lead/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.data.success) {
          setLead(response.data.lead);
        }
      } catch (error) {
        if (error.response && !error.response.data.success) {
          alert(error.response.data.error);
        }
      }
    };

    fetchLead();
  }, [id]);

  const toggleDetails = () => setShowDetails(!showDetails);

  const handleAddNote = async () => {
    try {
      const token = localStorage.getItem("token"); // Get the token for authorization
      const payload = {
        leadId: id, // Assuming `id` is the lead's ID from useParams
        title: noteTitle,
        content: noteContent,
      };

      const response = await axios.post(`${apiUrl}/api/note/add`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        alert("Note added successfully!");
        // Clear inputs and close modal
        setNoteTitle("");
        setNoteContent("");
        setIsNoteModalOpen(false);
      } else {
        alert("Failed to save the note: " + response.data.message);
      }
    } catch (error) {
      console.error("Error saving note:", error);
      alert("An error occurred while saving the note.");
    }
  };

  const handleAddCallLog = async () => {
    try {
      const token = localStorage.getItem("token"); // Get the token for authorization
      const payload = {
        leadId: id, // Assuming `id` is the lead's ID from useParams
        callDuration: callDuration,
        callNotes: callNotes,
      };

      const response = await axios.post("${apiUrl}/api/calllog/add", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        alert("Call log added successfully!");
        setCallDuration("");
        setCallNotes("");
        setIsCallLogModalOpen(false);
      } else {
        alert("Failed to save the call log: " + response.data.message);
      }
    } catch (error) {
      console.error("Error saving call log:", error);
      alert("An error occurred while saving the call log.");
    }
  };

  return (
    <>
      {lead ? (
        <div className="min-h-screen bg-gray-100 px-10 py-8">
          {/* Header Section */}
          <div className="border-b border-gray-300 pb-6 mb-8">
            <h1 className="text-4xl font-bold text-gray-800">{lead.name}</h1>
            <p className="text-sm text-gray-600">{lead.email}</p>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-12 gap-8">
            {/* Section 1: Lead Info and Actions */}
            <div className="col-span-12 lg:col-span-4 bg-white rounded-md shadow-md p-6 space-y-6">
              <h2 className="text-xl font-bold border-b pb-2">Lead Info</h2>
              <div className="space-y-4">
                <p>
                  <span className="font-semibold">Phone:</span> {lead.phone}
                </p>
                <p>
                  <span className="font-semibold">Company:</span> {lead.company}
                </p>
                <p>
                  <span className="font-semibold">Country:</span>{" "}
                  {lead.country || "Not Provided"}
                </p>
                <p>
                  <span className="font-semibold">Status:</span> {lead.status}
                </p>
                <p>
                  <span className="font-semibold">Created At:</span>{" "}
                  {new Date(lead.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold">Actions</h3>
                <div className="flex flex-wrap gap-4">
                  <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600">
                    <FaPhone className="mr-2" /> Call
                  </button>
                  <button className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md shadow-md hover:bg-green-600">
                    <FaEnvelope className="mr-2" /> Email
                  </button>
                  <button className="flex items-center px-4 py-2 bg-purple-500 text-white rounded-md shadow-md hover:bg-purple-600">
                    <FaUserPlus className="mr-2" 
                    /> Assign
                  </button>
                  <button className="flex items-center px-4 py-2 bg-red-500 text-white rounded-md shadow-md hover:bg-red-600">
                    <FaBan className="mr-2" /> Block Lead
                  </button>
                  <button className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-md shadow-md hover:bg-gray-600">
                    <FaTrash className="mr-2" /> Delete Lead
                  </button>
                  <button
                    onClick={() => setIsNoteModalOpen(true)}
                    className="flex items-center px-4 py-2 bg-yellow-500 text-white rounded-md shadow-md hover:bg-yellow-600"
                  >
                    <FaStickyNote className="mr-2" /> Notes
                  </button>
                  {/* Call Log Button */}
                  <button
                    onClick={() => setIsCallLogModalOpen(true)}
                    className="flex items-center px-4 py-2 bg-teal-500 text-white rounded-md shadow-md hover:bg-teal-600"
                  >
                    <FaPhone className="mr-2" /> Call Log
                  </button>
                </div>
              </div>
            </div>

            {/* Section 2: Employee Activities */}
            <div className="col-span-12 lg:col-span-5 bg-white rounded-md shadow-md p-6">
              <h2 className="text-xl font-bold border-b pb-2">
                Employee Activities
              </h2>
              <div className="space-y-3 mt-4">
                <p className="text-gray-600">No meetings scheduled yet.</p>
                <p className="text-gray-600">No notes added by employees.</p>
              </div>
            </div>

            {/* Section 3: Additional Lead Details */}
            <div className="col-span-12 lg:col-span-3 bg-white rounded-md shadow-md p-6">
              <h2 className="text-xl font-bold border-b pb-2">
                Additional Details
              </h2>
              <div className="mt-4 space-y-4">
                <p>
                  <span className="font-semibold">Associated Company:</span>{" "}
                  {lead.associatedCompany || "N/A"}
                </p>
                <p>
                  <span className="font-semibold">Owner:</span>{" "}
                  {lead.owner || "N/A"}
                </p>
                <p>
                  <span className="font-semibold">BDR Owner:</span>{" "}
                  {lead.bdrOwner || "N/A"}
                </p>
                <p>
                  <span className="font-semibold">Lead Status:</span>{" "}
                  {lead.status}
                </p>
                <p>
                  <span className="font-semibold">Last Touch Point:</span>{" "}
                  {lead.lastTouchPoint || "N/A"}
                </p>
                <p>
                  <span className="font-semibold">LinkedIn URL:</span>
                  {lead.linkedinURL ? (
                    <a
                      href={lead.linkedinURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      View Profile
                    </a>
                  ) : (
                    "N/A"
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Note Modal */}
          {isNoteModalOpen && (
            <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
              <div className="bg-white rounded-md shadow-lg w-96 p-6">
                <h2 className="text-xl font-bold mb-4">Add Note</h2>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="noteTitle"
                      className="block text-sm font-bold"
                    >
                      Title
                    </label>
                    <input
                      id="noteTitle"
                      type="text"
                      value={noteTitle}
                      onChange={(e) => setNoteTitle(e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="noteContent"
                      className="block text-sm font-bold"
                    >
                      Content
                    </label>
                    <textarea
                      id="noteContent"
                      value={noteContent}
                      onChange={(e) => setNoteContent(e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2"
                      rows="4"
                    ></textarea>
                  </div>
                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={() => setIsNoteModalOpen(false)}
                      className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddNote}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Call Log Modal */}
          {isCallLogModalOpen && (
            <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
              <div className="bg-white rounded-md shadow-lg w-96 p-6">
                <h2 className="text-xl font-bold mb-4">Add Call Log</h2>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="callDuration"
                      className="block text-sm font-bold"
                    >
                      Call Duration (mins)
                    </label>
                    <input
                      id="callDuration"
                      type="text"
                      value={callDuration}
                      onChange={(e) => setCallDuration(e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="callNotes"
                      className="block text-sm font-bold"
                    >
                      Call Notes
                    </label>
                    <textarea
                      id="callNotes"
                      value={callNotes}
                      onChange={(e) => setCallNotes(e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2"
                      rows="4"
                    ></textarea>
                  </div>
                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={() => setIsCallLogModalOpen(false)}
                      className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddCallLog}
                      className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex justify-center items-center h-screen">
          <p>Loading...</p>
        </div>
      )}
    </>
  );
};

export default ViewLead;
