import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaPhone, FaEnvelope, FaUserPlus, FaBan, FaTrash, FaStickyNote, FaRegPaperPlane, FaCopy } from "react-icons/fa";
import { FaPencilAlt } from "react-icons/fa";
import { toast } from "react-hot-toast"; // Import react-hot-toast for notifications
import Loader from "../Loading/Loader";
import ScheduleMeeting from "./ScheduleMeeting";
import CallPopup from "./CallPopup"; // Import the CallPopup component

const ViewLead = () => {
  const { id } = useParams();
  const [lead, setLead] = useState(null);
  const [notes, setNotes] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isCallLogModalOpen, setIsCallLogModalOpen] = useState(false);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [callDuration, setCallDuration] = useState("");
  const [callNotes, setCallNotes] = useState("");
  const [showScheduleMeeting, setShowScheduleMeeting] = useState(false);
  const [isCallPopupOpen, setIsCallPopupOpen] = useState(false); // State for the Call Popup
  const [callLogs, setCallLogs] = useState("");

  const apiUrl = import.meta.env.VITE_API_URL;

  // Function to toggle the ScheduleMeeting modal
  const handleMeetingButtonClick = () => {
    setShowScheduleMeeting(true);
  };

  const handleCloseModal = () => {
    setShowScheduleMeeting(false);
  };

  // Optimized fetchLead with error handling and notifications
  const fetchLead = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/lead/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.data.success) {
        setLead(response.data.lead);
      } else {
        toast.error(response.data.message || "Failed to fetch lead");
      }
    } catch (error) {
      toast.error("Error fetching lead details");
    }
  };

  const fetchNotes = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/note/notes/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.data.success) {
        setNotes(response.data.notes);
        // console.log("Notes:", response.data.notes);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      // toast.error("Error fetching notes");
      console.error("Error fetching notes:", error);
      return null; // Return null if there's an error
    }
  };

  useEffect(() => {
    fetchLead();
    fetchNotes();
  }, [id]);

  const toggleDetails = () => setShowDetails(!showDetails);

  // Handle adding notes with success and error notifications
  const handleAddNote = async () => {
    try {
      const token = localStorage.getItem("token");
      const payload = { leadId: id, title: noteTitle, content: noteContent };

      const response = await axios.post(`${apiUrl}/api/note/add`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        toast.success("Note added successfully!");
        setNoteTitle("");
        setNoteContent("");
        setIsNoteModalOpen(false);
      } else {
        toast.error("Failed to save the note: " + response.data.message);
      }
    } catch (error) {
      toast.error("An error occurred while saving the note.");
    }
  };

  // Handle adding call logs with success and error notifications
  const handleAddCallLog = async () => {
    try {
      const token = localStorage.getItem("token");
      const payload = { leadId: id, callDuration, callNotes };

      const response = await axios.post(`${apiUrl}/api/calllog/add`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        toast.success("Call log added successfully!");
        setCallDuration("");
        setCallNotes("");
        setIsCallLogModalOpen(false);
      } else {
        toast.error("Failed to save the call log: " + response.data.message);
      }
    } catch (error) {
      toast.error("An error occurred while saving the call log.");
    }
  };

  // Function to handle opening the Call Popup
  const handleCallButtonClick = () => {
    setIsCallPopupOpen(true); // Open the call popup modal
  };

  // Function to handle closing the Call Popup
  const handleCloseCallPopup = () => {
    setIsCallPopupOpen(false); // Close the call popup modal
  };

  // Function to handle initiating the call using RingCentral
  const handleCallInitiate = async () => {
    try {
      const phoneNumber = lead.phone;
      const response = await axios.post(
        `${apiUrl}/api/ringcentral/call`,
        { phoneNumber },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Call initiated successfully!");
        setIsCallPopupOpen(false); // Close the call popup
      } else {
        toast.error("Failed to initiate the call.");
      }
    } catch (error) {
      toast.error("An error occurred while initiating the call.");
    }
  };

  // Function to save updated lead information
  const handleSaveLead = async (updatedLead) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${apiUrl}/api/lead/${id}`,
        updatedLead,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        toast.success("Lead updated successfully!");
        setLead(updatedLead); // Update the local state with the new lead data
      } else {
        toast.error("Failed to update lead: " + response.data.message);
      }
    } catch (error) {
      toast.error("An error occurred while updating the lead.");
    }
  };

  // Function to delete a lead
const handleDeleteLead = async () => {
  // Open a custom confirmation modal
  const isConfirmed = await openConfirmationModal({
    title: "Delete Lead",
    message: "Are you sure you want to delete this lead?",
    confirmText: "Delete",
    cancelText: "Cancel",
  });

  if (!isConfirmed) {
    return; // Exit the function if the user cancels
  }

  try {
    const response = await axios.delete(`${apiUrl}/api/lead/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });

    console.log("Delete response:", response);
    if (response.data.success) {
      toast.success("Lead deleted successfully!");
      window.location.href = "/admin-dashboard/leads";
    } else {
      toast.error("Failed to delete lead: " + response.data.message);
    }
  } catch (error) {
    toast.error("An error occurred while deleting the lead.");
  }
};

// Example of a custom confirmation modal function
const openConfirmationModal = ({ title, message, confirmText, cancelText }) => {
  return new Promise((resolve) => {
    // Render your custom modal here
    // For example, using a library like Material-UI or Ant Design
    // Resolve with `true` if the user confirms, `false` if they cancel
    // Example:
    const userConfirmed = window.confirm(message); // Replace with your modal logic
    resolve(userConfirmed);
  });
};
  return (
    <>
      {!lead ? (
        <Loader />
      ) : (
        <div className="min-h-screen bg-gray-100 px-10 py-8">
          {/* Header Section */}
          <div>
            <h1 className="text-4xl font-bold text-gray-800">{lead.name}</h1>
            <div className="flex items-center space-x-2">
              <p className=" py-3 text-sm text-gray-600">{lead.email}</p>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(lead.email);
                  toast.success("Email copied to clipboard");
                }}
                className="text-gray-500 hover:text-gray-700 transition"
              >
                <FaCopy size={18} />
              </button>
            </div>
          </div>


          {/* Main Content */}
          <div className="grid grid-cols-12 gap-8">
            {/* Section 1: Lead Info and Actions */}
            <div className="col-span-12 lg:col-span-4 bg-white rounded-md shadow-md p-6 space-y-6">
              <h2 className="text-xl font-bold border-b pb-2">Lead Info</h2>
              <EditableLeadInfo lead={lead} onSave={handleSaveLead} />

              <div className="space-y-4">
                <h3 className="text-lg font-bold">Actions</h3>
                <div className="flex flex-wrap gap-4">
                  {[
                    // { label: "Call", icon: <FaPhone />, color: "blue-500", action: handleCallButtonClick },
                    // { label: "Email", icon: <FaEnvelope />, color: "green-500" },
                    // { label: "Assign", icon: <FaUserPlus />, color: "purple-500" },
                    // { label: "Block Lead", icon: <FaBan />, color: "red-500" },
                    { label: "Delete Lead", icon: <FaTrash />, color: "gray-500", action: handleDeleteLead },
                    { label: "Notes", icon: <FaStickyNote />, color: "yellow-500", action: () => setIsNoteModalOpen(true) },
                    { label: "Call Log", icon: <FaPhone />, color: "teal-500", action: () => setIsCallLogModalOpen(true) },
                    { label: "Meeting", icon: <FaRegPaperPlane />, color: "indigo-500", action: handleMeetingButtonClick }
                  ].map(({ label, icon, color, action }, index) => (
                    <button
                      key={index}
                      onClick={action}
                      className="group relative flex items-center justify-center p-3 border border-gray-300 rounded-full shadow-md hover:bg-transparent hover:text-gray-500 transition duration-200"
                    >
                      <span className={`text-lg text-gray-500 group-hover:text-${color}`}>
                        {icon}
                      </span>
                      <span className="absolute top-full mt-1 scale-0 rounded bg-black text-white px-2 py-1 text-xs transition-all duration-200 group-hover:scale-100">
                        {label}
                      </span>
                    </button>
                  ))}
                </div>


              </div>
            </div>
            {/* Section 2: Employee Activities */}
            <div className="col-span-12 lg:col-span-5 bg-white dark:bg-gray-800 rounded-md shadow-md p-6">
              <h2 className="text-xl font-bold border-b pb-2 text-gray-900 dark:text-gray-100">
                Employee Activities
              </h2>
              <div className="space-y-4 mt-4">
                {notes && notes.length > 0 ? (
                  notes.map((note) => (
                    <div key={note._id} className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {note.title}
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 mt-1">{note.content}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        {new Date(note.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">No notes added by employees.</p>
                )}
              </div>
            </div>


            {/* Section 3: Lead Details */}
            <div className="col-span-12 lg:col-span-3 bg-white rounded-md shadow-md p-6">
              <button onClick={toggleDetails} className="w-full text-left text-lg font-semibold text-teal-500">
                {showDetails ? "Hide Details" : "Show Details"}
              </button>
              {showDetails && (
                <div className="mt-4 space-y-3">
                  <p><span className="font-semibold">Lead Info:</span> {lead.details}</p>
                </div>
              )}
            </div>
          </div>

          {/* Call Popup */}
          {isCallPopupOpen && <CallPopup onClose={handleCloseCallPopup} onCallInitiate={handleCallInitiate} />}

          {/* Note Modal */}
          {isNoteModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-md shadow-md w-96">
                <h2 className="text-xl font-bold mb-4">Add Note</h2>
                <input
                  type="text"
                  placeholder="Title"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md mb-4"
                />
                <textarea
                  placeholder="Content"
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md mb-4"
                  rows="4"
                />
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setIsNoteModalOpen(false)}
                    className="px-4 py-2 border border-black text-black bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    ❌ Cancel
                  </button>
                  <button
                    onClick={handleAddNote}
                    className="px-4 py-2 border border-black text-black bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    💾 Save
                  </button>

                </div>
              </div>
            </div>
          )}

          {/* Call Log Modal */}
          {isCallLogModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-md shadow-md w-96">
                <h2 className="text-xl font-bold mb-4">Add Call Log</h2>
                <input
                  type="text"
                  placeholder="Call Duration"
                  value={callDuration}
                  onChange={(e) => setCallDuration(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md mb-4"
                />
                <textarea
                  placeholder="Call Notes"
                  value={callNotes}
                  onChange={(e) => setCallNotes(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md mb-4"
                  rows="4"
                />
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setIsCallLogModalOpen(false)}
                    className="px-4 py-2 border border-black text-black bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    ❌ Cancel
                  </button>
                  <button
                    onClick={handleAddCallLog}
                    className="px-4 py-2 border border-black text-black bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    📞 Save
                  </button>

                </div>
              </div>
            </div>
          )}
        </div >
      )}
    </>
  );
};

// EditableLeadInfo Component
const EditableLeadInfo = ({ lead, onSave }) => {
  const [editableLead, setEditableLead] = useState(lead);
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (field, value) => {
    setEditableLead({ ...editableLead, [field]: value });
  };

  const handleSave = () => {
    onSave(editableLead); // Call the onSave function passed from the parent component
    setIsEditing(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <label className="font-semibold">Phone:</label>
        {isEditing ? (
          <input
            type="text"
            value={editableLead.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            className="p-2 border rounded"
          />
        ) : (
          <p>{editableLead.phone}</p>
        )}
      </div>
      <div className="flex flex-col space-y-2">
        <label className="font-semibold">Phone1</label>
        {isEditing ? (
          <input
            type="text"
            value={editableLead.phone1}
            onChange={(e) => handleChange('phone1', e.target.value)}
            className="p-2 border rounded"
          />
        ) : (
          <p>{editableLead.phone1}</p>
        )}
      </div>

      <div className="flex flex-col space-y-2">
        <label className="font-semibold">Company:</label>
        {isEditing ? (
          <input
            type="text"
            value={editableLead.company}
            onChange={(e) => handleChange('company', e.target.value)}
            className="p-2 border rounded"
          />
        ) : (
          <p>{editableLead.company}</p>
        )}
      </div>

      <div className="flex flex-col space-y-2">
        <label className="font-semibold">Country:</label>
        {isEditing ? (
          <input
            type="text"
            value={editableLead.country || "Not Provided"}
            onChange={(e) => handleChange('country', e.target.value)}
            className="p-2 border rounded"
          />
        ) : (
          <p>{editableLead.country || "Not Provided"}</p>
        )}
      </div>
      <div className="flex flex-col space-y-2">
        <label className="font-semibold">Timezone:</label>
        {isEditing ? (
          <input
            type="text"
            value={editableLead.timeZone || "Not Provided"}
            onChange={(e) => handleChange('timeZone', e.target.value)}
            className="p-2 border rounded"
          />
        ) : (
          <p>{editableLead.timeZone || "Not Provided"}</p>
        )}
      </div>

      {/* <div className="flex flex-col space-y-2">
        <label className="font-semibold">Status:</label>
        {isEditing ? (
          <select
            value={editableLead.status}
            onChange={(e) => handleChange('status', e.target.value)}
            className="p-2 border rounded"
          >
            <option value="Unassigned">Unassigned</option>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Closed">Closed</option>
          </select>
        ) : (
          <p>{editableLead.status}</p>
        )}
      </div> */}

      <div className="flex flex-col space-y-2">
        <label className="font-semibold">Created At:</label>
        <p>{new Date(editableLead.createdAt).toLocaleDateString()}</p>
      </div>

      <div className="flex space-x-2">
        {isEditing ? (
        <button
        onClick={handleSave}
        className="px-4 py-2 border border-black text-black bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
      >
        Save
      </button>
    ) : (
      <button
        onClick={() => setIsEditing(true)}
        className="px-4 py-2 border border-black text-black bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 flex items-center"
      >
        <FaPencilAlt />
      </button>
        )}
      </div>
    </div>
  );
};

export default ViewLead;