import React, { useCallback } from "react";
import { NavLink } from "react-router-dom";
import { useState } from "react";
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
  FaAdn,
  FaClipboard,
  FaClipboardList,
  FaEnvelope,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext"; // Adjust path as needed

const AdminSidebar = () => {
  const { isSidebarOpen, toggleSidebar } = useAuth(); // Use AuthContext for sidebar state
  const [isHrOpen, setIsHrOpen] = useState(false); // Keep local state for HR section

  // Toggle HR section visibility
  const toggleHr = useCallback(() => {
    setIsHrOpen((prev) => !prev);
    // toast.success(`HR Section ${isHrOpen ? "collapsed" : "expanded"}`);
  }, [isHrOpen]);

  // Reusable NavItem component to avoid re-rendering issues
  const NavItem = React.memo(({ to, icon: Icon, label }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `${isActive ? "bg-gray-900" : ""} flex items-center px-4 py-2 text-white hover:bg-gray-700 transition-all duration-200`
      }
    >
      <Icon className="mr-4" />
      {isSidebarOpen && <span>{label}</span>}
    </NavLink>
  ));

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
        <NavItem to="/admin-dashboard/accounts" icon={FaAdn} label="Accounts" />
        <NavItem to="/admin-dashboard/meetings" icon={FaCalendarAlt} label="Meetings" />
        <NavItem to="/admin-dashboard/demos" icon={FaMoneyBillWave} label="Demos" />
        <NavItem to="/admin-dashboard/deals" icon={FaHandHoldingUsd} label="Deals" />
        <NavItem to="/admin-dashboard/dartboard" icon={FaClipboardList} label="Dartboard" />
        <NavItem to="/admin-dashboard/tasks" icon={FaUsers} label="Tasks" />
        <NavItem to="/admin-dashboard/reports" icon={FaBuilding} label="Reports" />
        <NavItem to="/admin-dashboard/sendemails" icon={FaEnvelope} label="Email" />

        {/* HR Section */}
        <div>
          <div
            className="flex items-center justify-between px-4 py-2 text-white mt-4 font-semibold cursor-pointer"
            onClick={toggleHr}
          >
            <span className="flex items-center">
              <FaClipboard className="mr-2" />
              {isSidebarOpen && "HR"} {/* Show "HR" only when sidebar is open */}
            </span>
            {isSidebarOpen && (isHrOpen ? <FaCaretUp /> : <FaCaretDown />)}{" "}
            {/* Show caret only when sidebar is open */}
          </div>

          {isHrOpen && isSidebarOpen && ( // Show HR items only when both are true
            <>
              <NavItem to="/admin-dashboard/employees" icon={FaUsers} label="Employees" />
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