import React, { useState, useEffect, useCallback } from 'react';
import {
  FaRegPaperPlane,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaUsers,
  FaFileAlt,
  FaTasks,
} from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Loader from '../Loading/Loader';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [leads, setLeads] = useState([]);
  const [leadCount, setLeadCount] = useState(0);
  const [meetingLoading, setMeetingLoading] = useState(false);
  const [meetings, setMeetings] = useState([]);
  const [meetingCount, setMeetingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;

  // Dark mode detection
  useEffect(() => {
    const htmlElement = document.documentElement;
    const updateDarkMode = () => setIsDarkMode(htmlElement.classList.contains('dark'));

    // Initial check
    updateDarkMode();

    // Observe class changes
    const observer = new MutationObserver(updateDarkMode);
    observer.observe(htmlElement, { attributes: true });

    return () => observer.disconnect();
  }, []);

  // Fetch Leads Function
  const fetchLeads = useCallback(async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/lead`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.data.success) {
        const latestLeads = response.data.leads.slice(0, 5); // Get top 5 leads
        setLeads(latestLeads);
        setLeadCount(response.data.leads.length);
        // toast.success('Leads fetched successfully!');
      }
    } catch (error) {
      console.error('Error fetching leads:', error.message);
      toast.error('Failed to fetch leads!');
    } finally {
      setLoading(false); // Set loading to false after fetching leads
    }
  }, [apiUrl]);

  // Fetch Meetings Function
  const fetchMeetings = useCallback(async () => {
    setMeetingLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/api/meeting`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.data.success) {
        setMeetings(response.data.meetings);
        setMeetingCount(response.data.meetings.length);
        // toast.success('Meetings fetched successfully!');
      }
    } catch (error) {
      console.error('Error fetching meetings:', error);
      toast.error('Failed to fetch meetings!');
    } finally {
      setMeetingLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchLeads();
    fetchMeetings();
  }, [fetchLeads, fetchMeetings]);

  // Chart data and options with dark mode support
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Sales Performance',
        data: [5000, 7000, 8000, 9000, 11000, 12000, 15000],
        fill: false,
        borderColor: isDarkMode ? '#3dd1b4' : '#1b0541',
        tension: 0.1,
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: isDarkMode ? '#fff' : '#1b0541',
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: isDarkMode ? '#1F2937' : '#fff',
        titleColor: isDarkMode ? '#fff' : '#1b0541',
        bodyColor: isDarkMode ? '#fff' : '#1b0541',
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: isDarkMode ? '#fff' : '#1b0541',
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: isDarkMode ? '#fff' : '#1b0541',
        },
        grid: {
          color: isDarkMode ? '#374151' : '#e5e7eb',
        },
      },
    },
  };

  return (
    <div className="flex flex-col h-screen p-6 bg-gray-100 dark:bg-gray-900">
      {/* Dashboard Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold text-[#1b0541] dark:text-white">Dashboard</h1>
        <button
          className="px-4 py-2 border border-black text-black bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
        // onClick={() => toast.success('New lead added successfully!')}
        >
          ➕ Add New Lead
        </button>
      </div>

      {/* Overview Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {[
          { icon: FaRegPaperPlane, title: 'Leads', value: leadCount },
          { icon: FaCalendarAlt, title: 'Meetings', value: meetingCount },
          { icon: FaMoneyBillWave, title: 'Sales', value: '$45,000' },
          { icon: FaUsers, title: 'Clients', value: '85' },
        ].map((item, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex items-center">
            <item.icon className="text-[#1b0541] dark:text-gray-300 text-3xl mr-4" />
            <div>
              <h2 className="text-xl font-semibold dark:text-gray-200">{item.title}</h2>
              <p className="text-2xl font-bold dark:text-white">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Latest Leads Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-2xl font-semibold text-[#1b0541] dark:text-white mb-4">Latest Leads</h2>
        {loading ? (
          <Loader />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b dark:border-gray-700">
                  <th className="px-4 py-2 dark:text-gray-300">Name</th>
                  <th className="px-4 py-2 dark:text-gray-300">Company</th>
                  <th className="px-4 py-2 dark:text-gray-300">Email</th>
                  <th className="px-4 py-2 dark:text-gray-300">Phone</th>
                  <th className="px-4 py-2 dark:text-gray-300">Status</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead._id} className="border-b dark:border-gray-700">
                    <td className="px-4 py-2 dark:text-gray-100">{lead.name}</td>
                    <td className="px-4 py-2 dark:text-gray-100">{lead.company}</td>
                    <td className="px-4 py-2 dark:text-gray-100">{lead.email}</td>
                    <td className="px-4 py-2 dark:text-gray-100">{lead.phone}</td>
                    <td className="px-4 py-2 text-green-500">{lead.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Upcoming Meetings and Sales Performance Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-[#1b0541] dark:text-white mb-4">Upcoming Meetings</h2>
          {meetingLoading ? (
            <Loader />
          ) : meetings.length > 0 ? (
            <div className="space-y-4">
              {meetings.map((meeting) => (
                <div key={meeting._id} className="flex justify-between">
                  <p className="text-lg dark:text-gray-100">{meeting.title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{meeting.meetingDate}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400">No Upcoming Meetings</p>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-[#1b0541] dark:text-white mb-4">Sales Performance</h2>
          <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Tasks & Reminders Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-2xl font-semibold text-[#1b0541] dark:text-white mb-4">Tasks & Reminders</h2>
        <div className="space-y-4">
          <div className="flex justify-between">
            <p className="text-lg dark:text-gray-100">Complete Lead Follow-Up</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Dec 10, 2024</p>
          </div>
          <div className="flex justify-between">
            <p className="text-lg dark:text-gray-100">Prepare Sales Pitch</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Dec 12, 2024</p>
          </div>
        </div>
      </div>

      {/* Reports Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-[#1b0541] dark:text-white mb-4">Reports</h2>
        <div className="flex space-x-4">
          <button
            className="px-4 py-2 border border-black text-black bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 flex items-center"
            onClick={() => toast.success('Sales report generated!')}
          >
            📊 <FaFileAlt className="mr-2" /> View Sales Report
          </button>

          <button
            className="px-4 py-2 border border-black text-black bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 flex items-center"
            onClick={() => toast.success('Leads report generated!')}
          >
            📄 <FaFileAlt className="mr-2" /> View Leads Report
          </button>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;