import React from 'react'
import Sidebar from '../components/EmployeeDashboard/Sidebar'
import {Outlet} from 'react-router-dom'
import Navbar from '../components/EmployeeDashboard/Navbar'

const EmployeeDashboard = () => {
  return (
    <div className="flex h-screen">
    {/* Sidebar */}
  
      <Sidebar  />
  

    {/* Main Content */}
    <div className="flex-1 flex flex-col bg-gray-100">
      {/* Navbar */}
      <Navbar />

      {/* Page Content */}
      <div className="p-4 overflow-auto">
        <Outlet />
      </div>
    </div>
  </div>
  )
}

export default EmployeeDashboard