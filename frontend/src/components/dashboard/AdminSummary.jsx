import React, { useState, useEffect } from 'react';
import { FaTachometerAlt, FaRegPaperPlane, FaCalendarAlt, FaMoneyBillWave, FaUsers, FaTasks, FaChartLine, FaFileAlt } from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import { toast } from 'react-hot-toast'; // Importing react-hot-toast
import Loader from '../Loading/Loader';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [leads, setLeads] = useState([]); // For storing fetched leads
  const [leadCount, setLeadCount] = useState(0); // For lead count
  const [meetingLoading, setMeetingLoading] = useState(false); // Add loading state for meetings
  const [meetings, setMeetings] = useState([]); // For storing fetched meetings
  const [meetingCount, setMeetingCount] = useState(0); // For meeting count
  const apiUrl = import.meta.env.VITE_API_URL; // Assuming the API URL is available in environment variables

  // Fetch Leads Function
  const fetchLeads = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/lead`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.success) {
        const latestLeads = response.data.leads.slice(0, 5); // Get top 5 leads
        setLeads(latestLeads);
        setLeadCount(response.data.leads.length); // Update lead count
        toast.success("Leads fetched successfully!"); // Success toast
      }
    } catch (error) {
      console.error("Error fetching leads:", error.message);
      toast.error("Failed to fetch leads!"); // Error toast
    }
  };

  // Fetch Meetings Function
  const fetchMeetings = async () => {
    setMeetingLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/api/meeting`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.success) {
        setMeetings(response.data.meetings);
        setMeetingCount(response.data.meetings.length);
        toast.success("Meetings fetched successfully!"); // Success toast
      }
    } catch (error) {
      console.error("Error fetching meetings:", error);
      toast.error("Failed to fetch meetings!"); // Error toast
    } finally {
      setMeetingLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
    fetchMeetings();
  }, []);

  // Data for the demo chart
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Sales Performance',
        data: [5000, 7000, 8000, 9000, 11000, 12000, 15000],
        fill: false,
        borderColor: '#3dd1b4',
        tension: 0.1,
        borderWidth: 2,
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="flex flex-col h-screen p-6 bg-gray-100">
      {/* Dashboard Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold text-[#1b0541]">Dashboard</h1>
        <button
          className="px-4 py-2 bg-[#3dd1b4] text-white rounded-lg"
          onClick={() => toast.success("New lead added successfully!")} // Success toast on button click
        >
          Add New Lead
        </button>
      </div>

      {/* Overview Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-lg flex items-center">
          <FaRegPaperPlane className="text-[#1b0541] text-3xl mr-4" />
          <div>
            <h2 className="text-xl font-semibold">Leads</h2>
            <p className="text-2xl font-bold">{leadCount}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg flex items-center">
          <FaCalendarAlt className="text-[#1b0541] text-3xl mr-4" />
          <div>
            <h2 className="text-xl font-semibold">Meetings</h2>
            <p className="text-2xl font-bold">{meetingCount}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg flex items-center">
          <FaMoneyBillWave className="text-[#1b0541] text-3xl mr-4" />
          <div>
            <h2 className="text-xl font-semibold">Sales</h2>
            <p className="text-2xl font-bold">$45,000</p> {/* Hardcoded Sales value */}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg flex items-center">
          <FaUsers className="text-[#1b0541] text-3xl mr-4" />
          <div>
            <h2 className="text-xl font-semibold">Clients</h2>
            <p className="text-2xl font-bold">85</p> {/* Hardcoded Clients value */}
          </div>
        </div>
      </div>

      {/* Latest Leads Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-2xl font-semibold text-[#1b0541] mb-4">Latest Leads</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Company</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Phone</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead._id} className="border-b">
                  <td className="px-4 py-2">{lead.name}</td>
                  <td className="px-4 py-2">{lead.company}</td>
                  <td className="px-4 py-2">{lead.email}</td>
                  <td className="px-4 py-2">{lead.phone}</td>
                  <td className="px-4 py-2 text-green-500">{lead.status}</td>
                </tr>
              ))}
              {leads.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500">
                    No Leads Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upcoming Meetings and Sales Performance Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-[#1b0541] mb-4">Upcoming Meetings</h2>
          <div className="space-y-4">
            {meetingLoading ? (
              <Loader />
            ) : meetings.length > 0 ? (
              meetings.map((meeting) => (
                <div key={meeting._id} className="flex justify-between">
                  <p className="text-lg">{meeting.agenda}</p>
                  <p className="text-sm text-gray-500">
                    {meeting.meetingDate}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No Upcoming Meetings</p>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-[#1b0541] mb-4">Sales Performance</h2>
          <div className="h-64 bg-gray-100 rounded-lg">
            <Line data={data} options={options} />
          </div>
        </div>
      </div>

      {/* Tasks and Reminders Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-2xl font-semibold text-[#1b0541] mb-4">Tasks & Reminders</h2>
        <div className="space-y-4">
          <div className="flex justify-between">
            <p className="text-lg">Complete Lead Follow-Up</p>
            <p className="text-sm text-gray-500">Dec 10, 2024</p>
          </div>
          <div className="flex justify-between">
            <p className="text-lg">Prepare Sales Pitch</p>
            <p className="text-sm text-gray-500">Dec 12, 2024</p>
          </div>
        </div>
      </div>

      {/* Reports Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-[#1b0541] mb-4">Reports</h2>
        <div className="flex space-x-4">
          <button className="px-4 py-2 bg-[#3dd1b4] text-white rounded-lg flex items-center">
            <FaFileAlt className="mr-2" /> View Sales Report
          </button>
          <button className="px-4 py-2 bg-[#3dd1b4] text-white rounded-lg flex items-center">
            <FaFileAlt className="mr-2" /> View Leads Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
