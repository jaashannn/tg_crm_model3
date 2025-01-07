import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Loading from '../Loading/Loader';

const Meetings = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [meetings, setMeetings] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    lead: '',
    assignedTo: '',
    meetingDate: '',
    meetingTime: '',
    agenda: '',
    notes: ''
  });
  const [empLoading, setEmpLoading] = useState(false); // Add loading state for employees
  const [meetingLoading, setMeetingLoading] = useState(false); // Add loading state for meetings

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    // Fetch employees
    const fetchEmployees = async () => {
      setEmpLoading(true);
      try {
        const response = await axios.get(`${apiUrl}/api/employee`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (response.data.success) {
          let sno = 1;
          const data = response.data.employees.map((emp) => ({
            _id: emp._id,
            name: emp.userId.name,
          }));
          setEmployees(data);
        }
      } catch (error) {
        console.log(error.message);
        if (error.response && !error.response.data.success) {
          alert(error.response.data.error);
        }
      } finally {
        setEmpLoading(false);
      }
    };

    // Fetch meetings
    const fetchMeetings = async () => {
      setMeetingLoading(true);
      try {
        // const response = await axios.get("${apiUrl}/api/meeting");

        const response = await axios.get(`${apiUrl}/api/meeting`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        
        console.log("Meeting")
        if (response.data.success) {
          setMeetings(response.data.meetings);
        }
        console.log(meetings)
      } catch (error) {
        console.error("Error fetching meetings:", error);
      } finally {
        setMeetingLoading(false);
      }
    };

    fetchEmployees();
    fetchMeetings();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const meetingData = {
      lead: formData.lead,
      assignedTo: formData.assignedTo,
      createdBy: 'admin', // Set this based on the logged-in user
      meetingDate: formData.meetingDate,
      meetingTime: formData.meetingTime,
      agenda: formData.agenda,
      notes: formData.notes,
    };

    axios
      .post(`${apiUrl}/api/meeting/add`, meetingData,{
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setMeetings([...meetings, response.data]);
        setFormData({
          title: '',
          lead: '',
          assignedTo: '',
          meetingDate: '',
          meetingTime: '',
          agenda: '',
          notes: '',
        });
      })
      .catch((error) => {
        console.error('Error creating meeting:', error);
      });
  };

  // Loading UI
  if (empLoading || meetingLoading) {
    return <Loading />;
  }

  return (
    <div className="meetings-page p-6">
      <div className="header flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Meetings</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Calendar Section */}
        <div className="calendar-section p-4 shadow bg-white rounded">
          <h2 className="text-lg font-semibold mb-4">Schedule a Meeting</h2>
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            className="rounded border"
          />
        </div>

        {/* Meeting Form */}
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
                className="w-full border border-gray-300 rounded p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Lead</label>
              <input
                type="text"
                name="lead"
                value={formData.lead}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Employee</label>
              <select
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded p-2"
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

            <div>
              <label className="block text-sm font-medium text-gray-700">Meeting Date</label>
              <input
                type="date"
                name="meetingDate"
                value={formData.meetingDate}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Meeting Time</label>
              <input
                type="time"
                name="meetingTime"
                value={formData.meetingTime}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Agenda</label>
              <textarea
                name="agenda"
                value={formData.agenda}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded p-2"
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
      </div>

      {/* Upcoming Meetings Table */}
      <div className="meetings-table-container overflow-x-auto">
        <h2 className="text-lg font-semibold mb-4">Upcoming Meetings</h2>
        <table className="meetings-table w-full border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">Title</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Employee</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Time</th>
              {/* <th className="border border-gray-300 px-4 py-2 text-left">Location</th> */}
            </tr>
          </thead>
          <tbody>
            {meetings.map((meeting) => (
              <tr key={meeting.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{meeting.agenda}</td>
                <td className="border border-gray-300 px-4 py-2">{meeting.createdBy}</td>
                <td className="border border-gray-300 px-4 py-2">{meeting.meetingDate}</td>
                <td className="border border-gray-300 px-4 py-2">{meeting.meetingTime}</td>
                {/* <td className="border border-gray-300 px-4 py-2">{meeting.location}</td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Meetings;
