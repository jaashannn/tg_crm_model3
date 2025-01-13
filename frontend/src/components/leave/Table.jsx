import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { columns, LeaveButtons } from "../../utils/LeaveHelper";
import axios from "axios";
import Loader from "../Loading/Loader";

const Table = () => {
  const [leaves, setLeaves] = useState(null); // Store all leaves
  const [filteredLeaves, setFilteredLeaves] = useState(null); // Store filtered leaves
  const apiUrl = import.meta.env.VITE_API_URL;

  const fetchLeaves = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/leave`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.data.success) {
        let sno = 1;
        const data = response.data.leaves.map((leave) => ({
          _id: leave._id,
          sno: sno++,
          employeeId: leave.employeeId.employeeId,
          name: leave.employeeId.userId.name,
          leaveType: leave.leaveType,
          department: leave.employeeId.department.dep_name,
          days: Math.abs(new Date(leave.endDate) - new Date(leave.startDate)) / (1000 * 3600 * 24), // Correct days calculation
          status: leave.status,
          action: <LeaveButtons Id={leave._id} />,
        }));
        setLeaves(data);
        setFilteredLeaves(data); // Initialize filtered leaves with all data
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        alert(error.response.data.error);
      }
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  // Filter leaves by employee ID
  const filterByInput = (e) => {
    const data = leaves.filter((leave) =>
      leave.employeeId.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredLeaves(data);
  };

  // Filter leaves by status (Pending, Approved, Rejected)
  const filterByButton = (status) => {
    const data = leaves.filter((leave) =>
      leave.status.toLowerCase().includes(status.toLowerCase())
    );
    setFilteredLeaves(data);
  };

  // Check if data is available before rendering
  if (!filteredLeaves) {
    return <Loader />; // Show loader while fetching data
  }

  return (
    <div className="p-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold">Manage Leaves</h3>
      </div>
      <div className="flex justify-between items-center mt-6">
        <input
          type="text"
          placeholder="Search By Emp Id"
          className="px-4 py-0.5 border"
          onChange={filterByInput}
        />
        <div className="space-x-3">
          <button
            className="px-2 py-1 bg-teal-600 text-white hover:bg-teal-700"
            onClick={() => filterByButton("Pending")}
          >
            Pending
          </button>
          <button
            className="px-2 py-1 bg-teal-600 text-white hover:bg-teal-700"
            onClick={() => filterByButton("Approved")}
          >
            Approved
          </button>
          <button
            className="px-2 py-1 bg-teal-600 text-white hover:bg-teal-700"
            onClick={() => filterByButton("Rejected")}
          >
            Rejected
          </button>
        </div>
      </div>

      <div className="mt-3">
        <DataTable columns={columns} data={filteredLeaves} pagination />
      </div>
    </div>
  );
};

export default Table;
