import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast"; // Import react-hot-toast
import { useAuth } from "../../context/AuthContext";

const ScheduleMeeting = ({ onClose, leadId }) => {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    assignedTo: "",
    meetingDate: "",
    meetingTime: "",
    agenda: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiUrl = import.meta.env.VITE_API_URL;

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/employee`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (response.data.success) {
        setEmployees(response.data.employees);
      } else {
        toast.error("Failed to fetch employees.");
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
      toast.error("Error fetching employees. Please try again.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.assignedTo || !formData.meetingDate || !formData.meetingTime) {
      toast.error("Please fill in all required fields!");
      return;
    }

    const selectedDate = new Date(`${formData.meetingDate}T${formData.meetingTime}:00`);
    const currentDate = new Date();

    if (selectedDate < currentDate) {
      toast.error("Meeting date and time cannot be in the past.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${apiUrl}/api/meeting/add`,
        {
          ...formData,
          lead: leadId, // Automatically set the lead ID
          createdBy: user?.role,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (response.data.success) {
        toast.success("Meeting scheduled successfully!");
        onClose(); // Close the modal on success
      } else {
        toast.error("Failed to schedule the meeting.");
      }
    } catch (error) {
      setError("Error scheduling meeting. Please try again.");
      console.error("Error scheduling meeting:", error);
      toast.error("Error scheduling meeting. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-lg font-semibold mb-4">Schedule Meeting</h2>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Meeting Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded p-1 text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Assign Employee</label>
            <select
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded p-1 text-sm"
              required
            >
              <option value="">Select Employee</option>
              {employees.map((employee) => (
                <option key={employee._id} value={employee._id}>
                  {employee.userId.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Meeting Date</label>
              <input
                type="date"
                name="meetingDate"
                value={formData.meetingDate}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded p-1 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Meeting Time (IST)</label>
              <input
                type="time"
                name="meetingTime"
                value={formData.meetingTime}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded p-1 text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Agenda</label>
            <textarea
              name="agenda"
              value={formData.agenda}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded p-1 text-sm"
              rows="2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded p-1 text-sm"
              rows="2"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
            >
              {loading ? "Scheduling..." : "Schedule"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleMeeting;
