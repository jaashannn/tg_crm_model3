import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from '../Loading/Loader';
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-hot-toast";
import { FaEye, FaTrash } from 'react-icons/fa'; // Import the eye icon from React Icons
import DemoFeedbackForm from './MeetingForm'; // Import the existing DemoFeedbackForm

const Meetings = () => {
  const [showFeedbackForm, setShowFeedbackForm] = useState(false); // To control feedback form visibility
  const [showFeedbackModal, setShowFeedbackModal] = useState(false); // To control feedback modal visibility
  const [selectedMeetingId, setSelectedMeetingId] = useState(null); // Track the selected meeting ID for feedback
  const [feedback, setFeedback] = useState(null); // Store feedback for the selected meeting
  const { user } = useAuth();
  const [meetings, setMeetings] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [leads, setLeads] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    lead: '',
    assignedTo: [],
    meetingDate: '',
    meetingTime: '',
    agenda: '',
    notes: '',
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredLeads, setFilteredLeads] = useState([]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Filter leads based on email
    if (value) {
      const filtered = leads.filter((lead) =>
        lead.email.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredLeads(filtered);
    } else {
      setFilteredLeads([]);
    }
  };

  const handleSelectLead = (lead) => {
    setFormData({ ...formData, lead: lead._id });
    setSearchTerm(lead.email);
    setFilteredLeads([]);
  };
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
            email: lead.email,
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
      // toast.error("Error fetching data. Please try again.");
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

  const handleDeleteMeeting = async (meetingId) => {
    if (!meetingId) {
      toast.error("Invalid meeting ID.");
      return;
    }

    try {
      const response = await axios.delete(`${apiUrl}/api/meeting/delete/${meetingId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      if (response.data.success) {
        setMeetings((prev) => prev.filter((meeting) => meeting._id !== meetingId));
        toast.success("Meeting deleted successfully!");
      }
    } catch (error) {
      toast.error("Error deleting meeting. Please try again.");
    }
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
        setSearchTerm(''); // Clear the search term
        setFilteredLeads([]); // Clear the filtered leads
        setFormData({
          title: '',
          lead: '',
          assignedTo: [],
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

  const handleStatusChange = async (meetingId, newStatus) => {
    try {
      await axios.patch(`${apiUrl}/api/meeting/${meetingId}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setMeetings((prevMeetings) =>
        prevMeetings.map((meeting) =>
          meeting._id === meetingId ? { ...meeting, status: newStatus } : meeting
        )
      );
      toast.success('Status updated successfully!');

      // Open feedback form if status is changed to "completed"
      if (newStatus === 'completed') {
        setSelectedMeetingId(meetingId); // Set the selected meeting ID
        setShowFeedbackForm(true); // Open the feedback form
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status.', error.message);
    }
  };

  const openFeedbackModal = async (meetingId) => {
    try {
      const response = await axios.get(`${apiUrl}/api/demo/${meetingId}/feedback`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      if (response.data.success) {
        setFeedback(response.data.feedback); // Store the feedback
        setSelectedMeetingId(meetingId); // Set the selected meeting ID
        setShowFeedbackModal(true); // Open the feedback modal
      } else {
        toast.error("No feedback found for this meeting.");
      }
    } catch (error) {
      toast.error("Error fetching feedback. Please try again.");
    }
  };

  const closeFeedbackModal = () => {
    setShowFeedbackModal(false);
    setSelectedMeetingId(null); // Reset the selected meeting ID
    setFeedback(null); // Reset the feedback
  };

  const closeFeedbackForm = () => {
    setShowFeedbackForm(false);
    setSelectedMeetingId(null); // Reset the selected meeting ID
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
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">Lead</label>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search by email"
              className="w-full border border-gray-300 rounded p-1 text-sm"
              required
              aria-label="Lead"
            />
            {filteredLeads.length > 0 && (
              <ul className="absolute left-0 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-40 overflow-y-auto z-10">
                {filteredLeads.map((lead) => (
                  <li
                    key={lead._id}
                    onClick={() => handleSelectLead(lead)}
                    className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                  >
                    {lead.email}
                  </li>
                ))}
              </ul>
            )}
          </div>


          <div>
            <label className="block text-sm font-medium text-gray-700">Assign Employees</label>
            <select
              name="assignedTo"
              onChange={(e) => {
                const selectedEmployeeId = e.target.value;
                const selectedEmployee = employees.find(emp => emp._id === selectedEmployeeId);

                if (selectedEmployee && !formData.assignedTo.includes(selectedEmployeeId)) {
                  setFormData((prev) => ({
                    ...prev,
                    assignedTo: [...prev.assignedTo, selectedEmployeeId]
                  }));
                }
              }}
              className="w-full border border-gray-300 rounded p-1 text-sm"
              aria-label="Assigned Employees"
            >
              <option value="">Select Employee</option>
              {employees.map((employee) => (
                <option key={employee._id} value={employee._id}>
                  {employee.name}
                </option>
              ))}
            </select>

            {/* Display Selected Employees */}
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.assignedTo.map((employeeId) => {
                const employee = employees.find(emp => emp._id === employeeId);
                return employee ? (
                  <div
                    key={employeeId}
                    className="bg-gray-200 px-3 py-1 rounded-full text-sm flex items-center"
                  >
                    {employee.name}
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({
                        ...prev,
                        assignedTo: prev.assignedTo.filter(id => id !== employeeId)
                      }))}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </div>
                ) : null;
              })}
            </div>
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
            className="px-4 py-2 border border-black text-black bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
          >
            📅 Add Meeting
          </button>

        </form>
      </div>

      {/* Right Section: Upcoming Meetings */}
      <div className="upcoming-meetings p-4 shadow bg-white rounded max-h-96 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Upcoming Meetings</h2>
        {meetings.filter(meeting => meeting.status === 'Null').length === 0 ? (
          <p className="text-sm text-gray-600">No upcoming meetings scheduled.</p>
        ) : (
          <ul className="space-y-4">
            {meetings.filter(meeting => meeting.status !== 'completed').map((meeting) => (
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
                <div className="mt-2">
                  <label htmlFor={`status-${meeting._id}`} className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    id={`status-${meeting._id}`}
                    name="status"
                    value={meeting.status || 'Null'}
                    onChange={(e) => handleStatusChange(meeting._id, e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="Null" class="text-red-500">Null</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="no show">No Show</option>
                    <option value="reschedule">Reschedule</option>
                  </select>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Completed Meetings Section */}
      <div className="completed-meetings p-4 shadow bg-white rounded mt-4">
        <h2 className="text-lg font-semibold mb-4">Completed Meetings</h2>
        {meetings.filter(meeting => meeting.status === 'completed').length === 0 ? (
          <p className="text-sm text-gray-600">No completed meetings available.</p>
        ) : (
          <ul className="space-y-4">
            {meetings.filter(meeting => meeting.status === 'completed').map((meeting) => (
              <li key={meeting._id} className="p-3 border border-gray-200 rounded flex justify-between items-center">
                <div>
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
                </div>
                <div className="flex space-x-3">
                  {/* Eye button to open feedback modal */}
                  <button
                    onClick={() => openFeedbackModal(meeting._id)}
                    className="text-blue-500 hover:text-blue-700"
                    title="View Feedback"
                  >
                    <FaEye className="inline-block" />
                  </button>

                  {/* Delete button */}
                  <button
                    onClick={() => handleDeleteMeeting(meeting._id)}
                    className="text-red-500 hover:text-red-700"
                    title="Delete Meeting"
                  >
                    <FaTrash className="inline-block" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Feedback Form Modal */}
      {showFeedbackForm && (
        <DemoFeedbackForm
          closeForm={closeFeedbackForm}
          meetingId={selectedMeetingId} // Pass the selected meeting ID to the form
        />
      )}

      {/* Feedback Display Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-md">
            <h2 className="text-lg font-semibold mb-4">Meeting Feedback</h2>
            {feedback ? (
              <div>
                <p><strong>Prospect Name:</strong> {feedback.prospectName}</p>
                <p><strong>Title Level:</strong> {feedback.titleLevel}</p>
                <p><strong>LinkedIn:</strong> {feedback.linkedin}</p>
                <p><strong>Role:</strong> {feedback.role}</p>
                <p><strong>Email:</strong> {feedback.email}</p>
                <p><strong>Phone:</strong> {feedback.phone}</p>
                <p><strong>Website:</strong> {feedback.website}</p>
                <p><strong>Budget:</strong> {feedback.budget}</p>
                <p><strong>Authority:</strong> {feedback.authority}</p>
                <p><strong>Need:</strong> {feedback.need}</p>
                <p><strong>POC Criteria:</strong> {feedback.pocCriteria}</p>
                <p><strong>Opportunity:</strong> {feedback.opportunity}</p>
              </div>
            ) : (
              <p>No feedback available for this meeting.</p>
            )}
            <button
              onClick={closeFeedbackModal}
              className="px-4 py-2 border border-black text-black bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
            >
              ❌ Close
            </button>

          </div>
        </div>
      )}
    </div>
  );
};

export default Meetings;