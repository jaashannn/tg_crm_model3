import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from '../Loading/Loader';
import { useAuth } from "../../context/authContext";

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
  const [leadLoading, setLeadLoading] = useState(true);

  const apiUrl = import.meta.env.VITE_API_URL;

  const fetchLeads = async () => {
    setLeadLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/api/lead`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.data.success) {
        let sno = 1;
        const data = response.data.leads.map((lead) => ({
          _id: lead._id,
          sno: sno++,
          leadId: lead.leadId,
          name: lead.name,
          email: lead.email,
          phone: lead.phone,
          company: lead.company,
          source: lead.source,
          status: lead.status,
        }));

        setLeads(data);
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLeadLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/employee`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (response.data.success) {
        const data = response.data.employees.map((emp) => ({
          _id: emp._id,
          name: emp.userId.name,
        }));
        setEmployees(data);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const fetchMeetings = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/meeting`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (response.data.success) {
        setMeetings(response.data.meetings);
      }
    } catch (error) {
      console.error('Error fetching meetings:', error);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchLeads();
    fetchEmployees();
    fetchMeetings();
    setLoading(false);
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
  
    // Log the form data to check if it's being submitted
    console.log('Form Data:', formData);
  
    if (!formData.title || !formData.lead || !formData.assignedTo || !formData.meetingDate || !formData.meetingTime) {
      alert('Please fill in all required fields!');
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
  
      console.log('Meeting Added:', response.data); // Log the response
  
      setMeetings((prev) => [...prev, response.data.meeting]);
      setFormData({
        title: '',
        lead: '',
        assignedTo: '',
        meetingDate: '',
        meetingTime: '',
        agenda: '',
        notes: '',
      });
    } catch (error) {
      console.error('Error creating meeting:', error);
      alert('Error adding meeting. Please try again.');
    }
  };

  if (loading || leadLoading) {
    return <Loader />;
  }

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
                  <strong>Date:</strong> {new Date(meeting.meetingDate).toLocaleDateString()}
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
