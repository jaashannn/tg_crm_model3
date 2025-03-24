import React from 'react';
import {
  MdHome,
  MdInfoOutline,
  MdGroup,
  MdFolderOpen,
  MdErrorOutline,
  MdBarChart,
  MdMailOutline,
  MdPerson,
  MdPhone,
  MdLanguage,
  MdSettings,
  MdLogout,
} from 'react-icons/md';

function Sidebar() {
  return (
    <div className="bg-white">
      <div className="flex-col flex">
        <div className="w-full border-b-2 border-gray-200"></div>
        <div className="flex bg-gray-100 overflow-x-hidden">
          <div className="bg-white lg:flex md:w-64 md:flex-col hidden">
            <div className="flex-col pt-5 flex overflow-y-auto">
              <div className="h-full flex-col justify-between px-4 flex">
                <div className="space-y-4">
                  {/* Dashboard */}
                  <a
                    href="#"
                    className="flex items-center rounded-lg text-gray-900 px-4 py-2.5 transition-all duration-200 hover:bg-gray-200 group cursor-pointer"
                  >
                    <MdHome className="flex-shrink-0 w-5 h-5 mr-4" />
                    <span>Dashboard</span>
                  </a>

                  {/* About */}
                  <a
                    href="#"
                    className="flex items-center rounded-lg text-gray-900 px-4 py-2.5 transition-all duration-200 hover:bg-gray-200 group cursor-pointer"
                  >
                    <MdInfoOutline className="flex-shrink-0 w-5 h-5 mr-4" />
                    <span>About</span>
                  </a>

                  {/* Hero */}
                  <a
                    href="#"
                    className="flex items-center rounded-lg text-gray-900 px-4 py-2.5 transition-all duration-200 hover:bg-gray-200 group cursor-pointer"
                  >
                    <MdGroup className="flex-shrink-0 w-5 h-5 mr-4" />
                    <span>Hero</span>
                  </a>
                </div>

                {/* Data */}
                <div>
                  <p className="px-4 font-semibold text-xs tracking-widest text-gray-400 uppercase">
                    Data
                  </p>
                  <div className="mt-4 space-y-1">
                    {/* Folders */}
                    <a
                      href="#"
                      className="flex items-center rounded-lg text-gray-900 px-4 py-2.5 transition-all duration-200 hover:bg-gray-200 group cursor-pointer"
                    >
                      <MdFolderOpen className="flex-shrink-0 w-5 h-5 mr-4" />
                      <span>Folders</span>
                    </a>

                    {/* Alerts */}
                    <a
                      href="#"
                      className="flex items-center rounded-lg text-gray-900 px-4 py-2.5 transition-all duration-200 hover:bg-gray-200 group cursor-pointer"
                    >
                      <MdErrorOutline className="flex-shrink-0 w-5 h-5 mr-4" />
                      <span>Alerts</span>
                    </a>

                    {/* Statistics */}
                    <a
                      href="#"
                      className="flex items-center rounded-lg text-gray-900 px-4 py-2.5 transition-all duration-200 hover:bg-gray-200 group cursor-pointer"
                    >
                      <MdBarChart className="flex-shrink-0 w-5 h-5 mr-4" />
                      <span>Statistics</span>
                      <span className="px-2 py-0.5 items-center font-semibold text-xs ml-auto bg-indigo-50 text-indigo-600 rounded-full uppercase border border-indigo-300 inline-flex">
                        New
                      </span>
                    </a>
                  </div>
                </div>

                {/* Contact */}
                <div>
                  <p className="px-4 font-semibold text-xs tracking-widest text-gray-400 uppercase">
                    Contact
                  </p>
                  <div className="mt-4 space-y-1">
                    {/* Forms */}
                    <a
                      href="#"
                      className="flex items-center rounded-lg text-gray-900 px-4 py-2.5 transition-all duration-200 hover:bg-gray-200 group cursor-pointer"
                    >
                      <MdMailOutline className="flex-shrink-0 w-5 h-5 mr-4" />
                      <span>Forms</span>
                      <span className="px-2 py-0.5 items-center font-semibold text-xs ml-auto bg-gray-500 text-white rounded-full uppercase border border-transparent inline-flex">
                        15
                      </span>
                    </a>

                    {/* Agents */}
                    <a
                      href="#"
                      className="flex items-center rounded-lg text-gray-900 px-4 py-2.5 transition-all duration-200 hover:bg-gray-200 group cursor-pointer"
                    >
                      <MdPerson className="flex-shrink-0 w-5 h-5 mr-4" />
                      <span>Agents</span>
                    </a>

                    {/* Customers */}
                    <a
                      href="#"
                      className="flex items-center rounded-lg text-gray-900 px-4 py-2.5 transition-all duration-200 hover:bg-gray-200 group cursor-pointer"
                    >
                      <MdPhone className="flex-shrink-0 w-5 h-5 mr-4" />
                      <span>Customers</span>
                    </a>
                  </div>
                </div>

                {/* Settings */}
                <div className="mt-12 pb-4">
                  <a
                    href="#"
                    className="flex items-center rounded-lg text-gray-900 px-4 py-2.5 transition-all duration-200 hover:bg-gray-200 group cursor-pointer"
                  >
                    <MdSettings className="flex-shrink-0 w-5 h-5 mr-4" />
                    <span>Settings</span>
                  </a>

                  {/* Logout */}
                  <a
                    href="#"
                    className="flex items-center rounded-lg text-gray-900 px-4 py-2.5 transition-all duration-200 hover:bg-gray-200 group cursor-pointer"
                  >
                    <MdLogout className="flex-shrink-0 w-5 h-5 mr-4" />
                    <span>Logout</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;