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
import { toast } from "react-hot-toast";

const AdminSidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isHrOpen, setIsHrOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
    toast.success(`Sidebar ${isSidebarOpen ? "closed" : "opened"}`); // Add toast on sidebar toggle
  };

  const toggleHr = () => {
    setIsHrOpen((prev) => !prev);
    toast.success(`HR Section ${isHrOpen ? "collapsed" : "expanded"}`); // Add toast on HR section toggle
  };

  const NavItem = ({ to, icon: Icon, label }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `${isActive ? "bg-gray-900" : ""} flex items-center px-4 py-2 text-white hover:bg-gray-700 transition-all duration-200`
      }
    >
      <Icon className="mr-4" />
      {isSidebarOpen && <span>{label}</span>}
    </NavLink>
  );

  return (
    <div
      className={`${isSidebarOpen ? "w-64" : "w-16"} transition-all duration-300 bg-[#1b0541] text-white h-screen flex flex-col`}
    >
      {/* Toggle Sidebar Button */}
      <button
        onClick={toggleSidebar}
        className="text-white p-4 bg-gray-700 hover:bg-gray-600 focus:outline-none"
        aria-label="Toggle Sidebar"
      >
        <FaBars />
      </button>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto">
        <NavItem to="/admin-dashboard" icon={FaTachometerAlt} label="Dashboard" />
        <NavItem to="/admin-dashboard/leads" icon={FaRegPaperPlane} label="Leads" />
        <NavItem to="/admin-dashboard/clients" icon={FaUsers} label="Clients" />
        <NavItem to="/admin-dashboard/meetings" icon={FaCalendarAlt} label="Meetings" />
        <NavItem to="/admin-dashboard/demos" icon={FaMoneyBillWave} label="Demos" />
        <NavItem to="/admin-dashboard/reports" icon={FaBuilding} label="Reports" />
        <NavItem to="/admin-dashboard/tasks" icon={FaUsers} label="Tasks" />
        <NavItem to="/admin-dashboard/Deals" icon={FaHandHoldingUsd} label="Deals" />

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
              <NavItem to="/admin-dashboard/employees" icon={FaUsers} label="Employees" />
              <NavItem to="/admin-dashboard/salary" icon={FaMoneyBillWave} label="Salary" />
              <NavItem to="/admin-dashboard/leaves" icon={FaCalendarAlt} label="Leaves" />
              <NavItem to="/admin-dashboard/departments" icon={FaBuilding} label="Departments" />
            </>
          )}
        </div>

        {/* Settings Link */}
        <NavItem to="/admin-dashboard/setting" icon={FaCogs} label="Settings" />
      </div>
    </div>
  );
};

export default AdminSidebar;
