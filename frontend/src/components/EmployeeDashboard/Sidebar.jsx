import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaTachometerAlt, FaRegPaperPlane, FaCalendarAlt, FaTasks, FaUserAlt, FaCogs, FaChartLine,FaBars } from "react-icons/fa";

const EmployeeSidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div
      className={`${
        isSidebarOpen ? "w-64" : "w-16"
      } transition-all duration-300 bg-[#1b0541] text-white h-screen flex flex-col`}
    >
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="text-white p-4 bg-gray-700 hover:bg-gray-600 focus:outline-none"
      >
        <FaBars />
      </button>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto">
        <NavLink
          to="/employee-dashboard"
          className={({ isActive }) =>
            `${
              isActive ? "bg-gray-900" : ""
            } flex items-center px-4 py-2 text-white hover:bg-gray-700 transition-all duration-200`
          }
        >
          <FaTachometerAlt className="mr-4" />
          {isSidebarOpen && <span>Dashboard</span>}
        </NavLink>

        <NavLink
          to="/employee-dashboard/leads"
          className={({ isActive }) =>
            `${
              isActive ? "bg-gray-900" : ""
            } flex items-center px-4 py-2 text-white hover:bg-gray-700 transition-all duration-200`
          }
        >
          <FaRegPaperPlane className="mr-4" />
          {isSidebarOpen && <span>Leads</span>}
        </NavLink>

        <NavLink
          to="/employee-dashboard/meetings"
          className={({ isActive }) =>
            `${
              isActive ? "bg-gray-900" : ""
            } flex items-center px-4 py-2 text-white hover:bg-gray-700 transition-all duration-200`
          }
        >
          <FaCalendarAlt className="mr-4" />
          {isSidebarOpen && <span>Meetings</span>}
        </NavLink>

        <NavLink
          to="/employee-dashboard/tasks"
          className={({ isActive }) =>
            `${
              isActive ? "bg-gray-900" : ""
            } flex items-center px-4 py-2 text-white hover:bg-gray-700 transition-all duration-200`
          }
        >
          <FaTasks className="mr-4" />
          {isSidebarOpen && <span>Tasks</span>}
        </NavLink>

        <NavLink
          to="/employee-dashboard/profile"
          className={({ isActive }) =>
            `${
              isActive ? "bg-gray-900" : ""
            } flex items-center px-4 py-2 text-white hover:bg-gray-700 transition-all duration-200`
          }
        >
          <FaUserAlt className="mr-4" />
          {isSidebarOpen && <span>Profile</span>}
        </NavLink>

        {/* <NavLink
          to="/employee-dashboard/reports"
          className={({ isActive }) =>
            `${
              isActive ? "bg-gray-900" : ""
            } flex items-center px-4 py-2 text-white hover:bg-gray-700 transition-all duration-200`
          }
        >
          <FaChartLine className="mr-4" />
          {isSidebarOpen && <span>Reports</span>}
        </NavLink> */}

        {/* Settings */}
        <NavLink
          to="/employee-dashboard/settings"
          className={({ isActive }) =>
            `${
              isActive ? "bg-gray-900" : ""
            } flex items-center px-4 py-2 text-white hover:bg-gray-700 transition-all duration-200`
          }
        >
          <FaCogs className="mr-4" />
          {isSidebarOpen && <span>Settings</span>}
        </NavLink>
      </div>
    </div>
  );
};

export default EmployeeSidebar;
