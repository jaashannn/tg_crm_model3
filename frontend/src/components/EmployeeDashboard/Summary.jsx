import React, { useState, useEffect } from "react";
import { FaTasks, FaChartLine, FaRegCalendarCheck, FaUsers, FaHandshake } from "react-icons/fa";
import { useAuth } from '../../context/authContext';


const EmployeeDashboard = () => {
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(true);
  const { user } = useAuth();

  // Use useEffect to hide the welcome message after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcomeMessage(false);
    }, 10000); // 10 seconds

    // Cleanup the timer when the component unmounts
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-[#f9fafb] min-h-screen flex flex-col p-6 space-y-8">
      {/* Welcome Message */}
      {showWelcomeMessage && (
        <div className="bg-white text-gray-800 p-4 rounded-lg shadow-md mb-6">
          <div className="text-lg font-medium mb-2">Welcome Back</div>
          <p className="text-md text-gray-600">
            Hello, {user.name}! We are glad to have you back on board. Keep up the great work!
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Here's a quick overview of your current tasks, reminders, and progress. Stay focused and keep achieving.
          </p>
        </div>
      )}

      {/* Dashboard Content */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Tasks */}
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between space-x-4 border border-gray-300">
          <div className="flex flex-col">
            <h3 className="text-xl font-semibold text-gray-700">Total Tasks</h3>
            <p className="text-3xl font-bold text-teal-600">15</p>
          </div>
          <FaTasks size={40} className="text-teal-600" />
        </div>

        {/* Performance */}
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between space-x-4 border border-gray-300">
          <div className="flex flex-col">
            <h3 className="text-xl font-semibold text-gray-700">Performance</h3>
            <p className="text-3xl font-bold text-teal-600">85%</p>
          </div>
          <FaChartLine size={40} className="text-teal-600" />
        </div>

        {/* Upcoming Reminders */}
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between space-x-4 border border-gray-300">
          <div className="flex flex-col">
            <h3 className="text-xl font-semibold text-gray-700">Upcoming Reminders</h3>
            <ul className="text-gray-600">
              <li className="mb-2">Complete the report for client A</li>
              <li className="mb-2">Attend the team meeting at 3 PM</li>
              <li>Submit the project update to the manager</li>
            </ul>
          </div>
        </div>

        {/* Team Members */}
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between space-x-4 border border-gray-300">
          <div className="flex flex-col">
            <h3 className="text-xl font-semibold text-gray-700">Team Members</h3>
            <p className="text-gray-600">You are working with 5 team members this week.</p>
          </div>
          <FaUsers size={40} className="text-teal-600" />
        </div>

        {/* Total Deals Overview */}
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between space-x-4 border border-gray-300">
          <div className="flex flex-col">
            <h3 className="text-xl font-semibold text-gray-700">Total Deals Made</h3>
            <p className="text-2xl font-bold text-teal-600">5</p>
          </div>
          <FaHandshake size={40} className="text-teal-600" />
        </div>
      </div>

      {/* Latest Updates Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-300">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Latest Updates</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-gray-800">Company-wide meeting on 10th Jan</span>
            <span className="text-xs text-gray-500">(HR Update)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-gray-800">New policy on work from home</span>
            <span className="text-xs text-gray-500">(HR Update)</span>
          </div>
        </div>
      </div>

      {/* Pending Leave Request Section */}
      <div className="bg-gray-100 p-4 rounded-lg shadow-sm border border-gray-200 mb-8">
        <h4 className="font-semibold text-gray-800">Leave Request</h4>
        <p className="text-gray-600">Status: Pending</p>
      </div>

      {/* Task List Section */}
      <div className="mt-8">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-300">
          <h2 className="text-xl font-semibold mb-4">Assigned Tasks</h2>
          <ul className="text-gray-600">
            <li className="flex justify-between mb-4">
              <span>Fix the login issue</span>
              <span className="text-gray-500">Due: 12/12/2024</span>
            </li>
            <li className="flex justify-between mb-4">
              <span>Prepare monthly report</span>
              <span className="text-gray-500">Due: 15/12/2024</span>
            </li>
            <li className="flex justify-between mb-4">
              <span>Implement new feature for client X</span>
              <span className="text-gray-500">Due: 18/12/2024</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
