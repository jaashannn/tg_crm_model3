import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Logo from "../../assets/icon.ico"; 
import { FaUsersCog } from "react-icons/fa"; 
import toast from 'react-hot-toast';

function Navbar() {
  const { user, logout } = useAuth(); 
  const [isCardOpen, setIsCardOpen] = useState(false); 
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);

  // Refs to track click outside the dropdowns
  const cardRef = useRef(null);
  const cardButtonRef = useRef(null);

  // Handle user logout
  const handleLogout = () => {
    logout(); // Trigger the logout function
    toast.success("Logged out successfully!"); // Toast notification on successful logout
  };

  // Toggle the admin card visibility
  const toggleCard = () => {
    setIsCardOpen(!isCardOpen);
  };

  // Toggle Quick Actions dropdown
  const toggleQuickActions = () => {
    setIsQuickActionsOpen(!isQuickActionsOpen);
  };

  // Close dropdowns if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        cardRef.current && !cardRef.current.contains(event.target) && // Check if click is outside the dropdown
        !cardButtonRef.current.contains(event.target) // Check if click is outside the button
      ) {
        setIsCardOpen(false); // Close the admin card dropdown
      }
    };

    document.addEventListener('mousedown', handleClickOutside); // Add event listener

    return () => {
      document.removeEventListener('mousedown', handleClickOutside); // Clean up event listener
    };
  }, []);

  return (
    <div>
      <div className="bg-white">
        <div className="flex-col flex">
          <div className="w-full border-b-2 border-gray-200">
            <div className="bg-white h-16 justify-between items-center mx-auto px-4 flex">
              {/* Logo Section */}
              <div>
                <img src={Logo} className="block h-8 w-auto" alt="Logo" />
              </div>
              
              {/* Search Input Section */}
              <div className="lg:block mr-auto ml-40 hidden relative max-w-xs">
                <p className="pl-3 items-center flex absolute inset-y-0 left-0 pointer-events-none">
                  <span className="justify-center items-center flex">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </span>
                </p>
                <input
                  placeholder="Type to search"
                  type="search"
                  className="border border-gray-300 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm w-full rounded-lg pt-2 pb-2 pl-10 px-3"
                />
              </div>

              {/* Quick Actions Dropdown */}
              <div className="md:space-x-6 justify-end items-center ml-auto flex space-x-3">
                <div className="relative">
                  <button
                    onClick={toggleQuickActions}
                    className="flex items-center px-3 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Quick Actions
                  </button>
                  {isQuickActionsOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md border border-gray-300 z-50">
                      <ul className="py-2">
                        <li
                          className="px-4 py-2 text-gray-700 cursor-pointer hover:bg-gray-200"
                          onClick={() => toast.info('Create Contact action triggered!')} // Toast notification
                        >
                          Create Contact
                        </li>
                        <li
                          className="px-4 py-2 text-gray-700 cursor-pointer hover:bg-gray-200"
                          onClick={() => toast.info('Assign Lead action triggered!')} // Toast notification
                        >
                          Assign Lead
                        </li>
                      </ul>
                    </div>
                  )}
                </div>

                {/* Profile Icon and Admin Dropdown */}
                <div
                  className="justify-center items-center flex relative cursor-pointer"
                  onClick={toggleCard} // Toggle visibility of admin card
                  ref={cardButtonRef}
                >
                  <FaUsersCog className="h-12 w-12 rounded-full bg-white text-gray-800 p-2" />
                  <p className="font-semibold text-sm">Admin</p>
                  {isCardOpen && (
                    <div
                      className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md border border-gray-300 z-50"
                      ref={cardRef}
                    >
                      <ul className="py-2">
                        <li
                          className="px-4 py-2 text-gray-700 cursor-pointer hover:bg-gray-200"
                          onClick={handleLogout} // Logout and show notification
                        >
                          Logout
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
