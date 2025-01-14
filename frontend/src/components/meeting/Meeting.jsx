import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from '../Loading/Loader';
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-hot-toast";

const Meetings = () => {
  const { user } = useAuth();
  const [meetings, setMeetings] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [leads, setLeads] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    lead: '',
    assignedTo: '',
    meetingDate: '',
    meetingTime: '',
    agenda: '',
    notes: '',
  });
  const [loading, setLoading] = useState(true);

  const apiUrl = import.meta.env.VITE_API_URL;

  const fetchData = async () => {
    try {
      setLoading(true);

      const [leadRes, employeeRes, meetingRes] = await Promise.all([
        axios.get(`${apiUrl}/api/lead`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }),
        axios.get(`${apiUrl}/api/employee`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }),
        axios.get(`${apiUrl}/api/meeting`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }),
      ]);

      if (leadRes.data.success) {
        setLeads(
          leadRes.data.leads.map((lead) => ({
            _id: lead._id,
            name: lead.name,
          }))
        );
      }

      if (employeeRes.data.success) {
        setEmployees(
          employeeRes.data.employees.map((emp) => ({
            _id: emp._id,
            name: emp.userId.name,
          }))
        );
      }

      if (meetingRes.data.success) {
        setMeetings(meetingRes.data.meetings);
      }
    } catch (error) {
      toast.error("Error fetching data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.lead ||
      !formData.assignedTo ||
      !formData.meetingDate ||
      !formData.meetingTime
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      const response = await axios.post(
        `${apiUrl}/api/meeting/add`,
        {
          ...formData,
          createdBy: user?.role,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );

      if (response.data.success) {
        setMeetings((prev) => [...prev, response.data.meeting]);
        toast.success("Meeting added successfully!");
        setFormData({
          title: '',
          lead: '',
          assignedTo: '',
          meetingDate: '',
          meetingTime: '',
          agenda: '',
          notes: '',
        });
      }
    } catch (error) {
      toast.error("Error adding meeting. Please try again.");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="meetings-page p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Left Section: Meeting Form */}
      <div className="schedule-meeting-form p-4 shadow bg-white rounded">
        <h2 className="text-lg font-semibold mb-4">Add New Meeting</h2>
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
              aria-label="Meeting Title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Lead</label>
            <select
              name="lead"
              value={formData.lead}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded p-1 text-sm"
              required
              aria-label="Lead"
            >
              <option value="">Select Lead</option>
              {leads.map((lead) => (
                <option key={lead._id} value={lead._id}>
                  {lead.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Assign Employee</label>
            <select
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded p-1 text-sm"
              required
              aria-label="Assigned Employee"
            >
              <option value="">Select Employee</option>
              {employees.map((employee) => (
                <option key={employee._id} value={employee._id}>
                  {employee.name}
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
                aria-label="Meeting Date"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Meeting Time</label>
              <input
                type="time"
                name="meetingTime"
                value={formData.meetingTime}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded p-1 text-sm"
                required
                aria-label="Meeting Time"
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-gradient-to-r from-teal-500 to-indigo-500 text-white font-semibold py-2 px-4 rounded hover:shadow-md"
          >
            Add Meeting
          </button>
        </form>
      </div>

      {/* Right Section: Upcoming Meetings */}
      <div className="upcoming-meetings p-4 shadow bg-white rounded">
        <h2 className="text-lg font-semibold mb-4">Upcoming Meetings</h2>
        {meetings.length === 0 ? (
          <p className="text-sm text-gray-600">No upcoming meetings scheduled.</p>
        ) : (
          <ul className="space-y-4">
            {meetings.map((meeting) => (
              <li key={meeting._id} className="p-3 border border-gray-200 rounded">
                <h3 className="font-medium">{meeting.title}</h3>
                <p className="text-sm text-gray-600">
                  <strong>Lead:</strong> {meeting.lead ? meeting.lead.name : 'N/A'}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Date:</strong>{' '}
                  {new Intl.DateTimeFormat('en-US').format(new Date(meeting.meetingDate))}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Time:</strong> {meeting.meetingTime}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Meetings;
