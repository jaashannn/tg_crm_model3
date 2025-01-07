import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';  // Import react-hot-toast for notifications
import Loading from '../../Loading/Loader';

const Meetings = () => {
  const [tasks, setTasks] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    taskId: '',
    meetingDate: '',
    meetingTime: '',
    agenda: '',
    notes: '',
  });
  const [taskLoading, setTaskLoading] = useState(false);
  const [meetingLoading, setMeetingLoading] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchTasks = async () => {
      setTaskLoading(true);
      try {
        const response = await axios.get(`${apiUrl}/api/task/mytask`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.data.success) {
          const data = response.data.tasks.map((task) => ({
            _id: task._id,
            leadName: task.lead.name,
            employeeName: task.employee.name,
            status: task.status,
            description: task.description,
            createdAt: task.createdAt,
          }));
          setTasks(data);
        }
      } catch (error) {
        console.log(error.message);
      } finally {
        setTaskLoading(false);
      }
    };

    const fetchMeetings = async () => {
      setMeetingLoading(true);
      try {
        const response = await axios.get(`${apiUrl}/api/meeting`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.data.success) {
          setMeetings(response.data.meetings);
        }
      } catch (error) {
        console.error('Error fetching meetings:', error);
      } finally {
        setMeetingLoading(false);
      }
    };

    fetchTasks();
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

    // Validate required fields
    if (!formData.taskId || !formData.title || !formData.meetingDate || !formData.meetingTime || !formData.agenda) {
      toast.error('Please fill all required fields!');
      return;
    }

    const meetingData = {
      taskId: formData.taskId,
      meetingDate: formData.meetingDate,
      meetingTime: formData.meetingTime,
      agenda: formData.agenda,
      notes: formData.notes,
      createdBy: 'employee', // or 'admin' based on the current logged-in user
    };

    console.log(formData.taskId, "its task id")
    axios
      .post(`${apiUrl}/api/meeting/add`, meetingData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((response) => {
        setMeetings([...meetings, response.data]);
        setFormData({
          title: '',
          taskId: '',
          meetingDate: '',
          meetingTime: '',
          agenda: '',
          notes: '',
        });
        toast.success('Meeting added successfully!');
      })
      .catch((error) => {
        console.error('Error creating meeting:', error);
        toast.error('Error creating meeting!');
      });
  };

  // Loading UI
  if (taskLoading || meetingLoading) {
    return <Loading />;
  }

  return (
    <div className="meetings-page p-6 flex">
      {/* Left Section: Meeting Form */}
      <div className="meeting-form-container w-2/3 p-4 shadow bg-white rounded mr-4">
        <h2 className="text-lg font-semibold mb-4">Add New Meeting</h2>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {/* Task Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Select Task</label>
            <select
              name="taskId"
              value={formData.taskId}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded p-2"
              required
            >
              <option value="">Select Task</option>
              {tasks.map((task) => (
                <option key={task._id} value={task._id}>
                  {task.leadName} - {task.status}
                </option>
              ))}
            </select>
          </div>

          {/* Meeting Title */}
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

          {/* Meeting Date */}
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

          {/* Meeting Time */}
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

          {/* Agenda */}
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

          {/* Notes */}
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

      {/* Right Section: Useful Information */}
      <div className="useful-info-container w-1/3 p-4 shadow bg-white rounded">
        <h2 className="text-lg font-semibold mb-4">Task Summary</h2>
        <ul className="space-y-2">
          {tasks.slice(0, 5).map((task) => (
            <li key={task._id} className="border-b pb-2">
              <p className="font-medium">{task.leadName}</p>
              <p className="text-sm text-gray-600">{task.description}</p>
              <p className="text-sm text-gray-500">Status: {task.status}</p>
            </li>
          ))}
        </ul>

        <h2 className="text-lg font-semibold mt-6 mb-4">Upcoming Meetings</h2>
        {meetings.length === 0 ? (
          <p className="text-sm text-gray-500">No Meetings</p>
        ) : (
          <ul className="space-y-2">
            {meetings.slice(0, 5).map((meeting) => (
              <li key={meeting._id} className="border-b pb-2">
                <p className="font-medium">{meeting.agenda}</p>
                <p className="text-sm text-gray-600">Date: {meeting.meetingDate}</p>
                <p className="text-sm text-gray-500">Time: {meeting.meetingTime}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Meetings;
