import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaBuilding,
  FaCalendarAlt,
  FaCogs,
  FaMoneyBillWave,
  FaTachometerAlt,
  FaUsers,
  FaRegPaperPlane,
  FaBars,
  FaCaretDown,
  FaCaretUp,
  FaHandHoldingUsd,
} from "react-icons/fa";

const AdminSidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isHrOpen, setIsHrOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const toggleHr = () => {
    setIsHrOpen((prev) => !prev);
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
        {/* Dashboard Link */}
        <NavLink
          to="/admin-dashboard"
          className={({ isActive }) =>
            `${
              isActive ? "bg-gray-900" : ""
            } flex items-center px-4 py-2 text-white hover:bg-gray-700 transition-all duration-200`
          }
          exact
        >
          <FaTachometerAlt className="mr-4" />
          {isSidebarOpen && <span>Dashboard</span>}
        </NavLink>

        {/* Leads Link */}
        <NavLink
          to="/admin-dashboard/leads"
          className={({ isActive }) =>
            `${
              isActive ? "bg-gray-900" : ""
            } flex items-center px-4 py-2 text-white hover:bg-gray-700 transition-all duration-200`
          }
        >
          <FaRegPaperPlane className="mr-4" />
          {isSidebarOpen && <span>Leads</span>}
        </NavLink>

        {/* Clients Link */}
        <NavLink
          to="/admin-dashboard/clients"
          className={({ isActive }) =>
            `${
              isActive ? "bg-gray-900" : ""
            } flex items-center px-4 py-2 text-white hover:bg-gray-700 transition-all duration-200`
          }
        >
          <FaUsers className="mr-4" />
          {isSidebarOpen && <span>Clients</span>}
        </NavLink>

        {/* Meetings Link */}
        <NavLink
          to="/admin-dashboard/meetings"
          className={({ isActive }) =>
            `${
              isActive ? "bg-gray-900" : ""
            } flex items-center px-4 py-2 text-white hover:bg-gray-700 transition-all duration-200`
          }
        >
          <FaCalendarAlt className="mr-4" />
          {isSidebarOpen && <span>Meetings</span>}
        </NavLink>

        {/* Sales Link */}
        <NavLink
          to="/admin-dashboard/demos"
          className={({ isActive }) =>
            `${
              isActive ? "bg-gray-900" : ""
            } flex items-center px-4 py-2 text-white hover:bg-gray-700 transition-all duration-200`
          }
        >
          <FaMoneyBillWave className="mr-4" />
          {isSidebarOpen && <span>Demos</span>}
        </NavLink>

        {/* Reports Link */}
        <NavLink
          to="/admin-dashboard/reports"
          className={({ isActive }) =>
            `${
              isActive ? "bg-gray-900" : ""
            } flex items-center px-4 py-2 text-white hover:bg-gray-700 transition-all duration-200`
          }
        >
          <FaBuilding className="mr-4" />
          {isSidebarOpen && <span>Reports</span>}
        </NavLink>

        {/* Tasks Link */}
        <NavLink
          to="/admin-dashboard/tasks"
          className={({ isActive }) =>
            `${
              isActive ? "bg-gray-900" : ""
            } flex items-center px-4 py-2 text-white hover:bg-gray-700 transition-all duration-200`
          }
        >
          <FaUsers className="mr-4" />
          {isSidebarOpen && <span>Tasks</span>}
        </NavLink>

          {/* Deal links */}
          <NavLink
          to="/admin-dashboard/Deals"
          className={({ isActive }) =>
            `${
              isActive ? "bg-gray-900" : ""
            } flex items-center px-4 py-2 text-white hover:bg-gray-700 transition-all duration-200`
          }
        >
          <FaHandHoldingUsd className="mr-4" />
          {isSidebarOpen && <span>Deals</span>}
        </NavLink>

            
        {/* HR Section */}
        <div>
          <div
            className="flex items-center justify-between px-4 py-2 text-white mt-4 font-semibold cursor-pointer"
            onClick={toggleHr}
          >
            <span>HR</span>
            {isHrOpen ? <FaCaretUp /> : <FaCaretDown />}
          </div>

          {isHrOpen && (
            <>
              <NavLink
                to="/admin-dashboard/employees"
                className={({ isActive }) =>
                  `${
                    isActive ? "bg-gray-900" : ""
                  } flex items-center px-4 py-2 text-white hover:bg-gray-700 transition-all duration-200`
                }
              >
                <FaUsers className="mr-4" />
                {isSidebarOpen && <span>Employees</span>}
              </NavLink>

              <NavLink
                to="/admin-dashboard/salary"
                className={({ isActive }) =>
                  `${
                    isActive ? "bg-gray-900" : ""
                  } flex items-center px-4 py-2 text-white hover:bg-gray-700 transition-all duration-200`
                }
              >
                <FaMoneyBillWave className="mr-4" />
                {isSidebarOpen && <span>Salary</span>}
              </NavLink>

              <NavLink
                to="/admin-dashboard/leaves"
                className={({ isActive }) =>
                  `${
                    isActive ? "bg-gray-900" : ""
                  } flex items-center px-4 py-2 text-white hover:bg-gray-700 transition-all duration-200`
                }
              >
                <FaCalendarAlt className="mr-4" />
                {isSidebarOpen && <span>Leaves</span>}
              </NavLink>

              <NavLink
                to="/admin-dashboard/departments"
                className={({ isActive }) =>
                  `${
                    isActive ? "bg-gray-900" : ""
                  } flex items-center px-4 py-2 text-white hover:bg-gray-700 transition-all duration-200`
                }
              >
                <FaBuilding className="mr-4" />
                {isSidebarOpen && <span>Departments</span>}
              </NavLink>
            </>
          )}
        </div>

        {/* Settings Link */}
        <NavLink
          to="/admin-dashboard/setting"
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

export default AdminSidebar;
