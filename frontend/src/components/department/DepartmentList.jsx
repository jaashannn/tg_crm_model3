import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import { columns, DepartmentButtons } from "../../utils/DepartmentHelper";
import axios from "axios";
import Loader from "../Loading/Loader";
import toast from "react-hot-toast"; // Import react-hot-toast for notifications

const DepartmentList = () => {
  const [departments, setDepartments] = useState([]);
  const [depLoading, setDepLoading] = useState(false);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const apiUrl = import.meta.env.VITE_API_URL; // API base URL

  // Function to refetch departments after a deletion
  const onDepartmentDelete = () => {
    fetchDepartments();
  };

  // Fetch departments from the API
  const fetchDepartments = async () => {
    setDepLoading(true); // Show loader while fetching data
    try {
      const response = await axios.get(`${apiUrl}/api/department`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.success) {
        let sno = 1;
        const data = response.data.departments.map((dep) => ({
          _id: dep._id,
          sno: sno++, 
          dep_name: dep.dep_name,
          action: (<DepartmentButtons Id={dep._id} onDepartmentDelete={onDepartmentDelete} />),
        }));
        setDepartments(data); // Set departments in state
        setFilteredDepartments(data); // Set filtered departments in state
        toast.success("Departments loaded successfully!"); // Success toast notification
      } else {
        toast.error("Failed to load departments."); // Error toast notification
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to fetch departments."); // Display error
    } finally {
      setDepLoading(false); // Hide loader after fetching
    }
  };

  // Filter departments based on the department name
  const filterDepartments = (e) => {
    const query = e.target.value.toLowerCase();
    const records = departments.filter((dep) =>
      dep.dep_name.toLowerCase().includes(query)
    );
    setFilteredDepartments(records); // Update filtered departments state
  };

  // Fetch departments when the component is mounted
  useEffect(() => {
    fetchDepartments();
  }, []);

  return (
    <>
      {depLoading ? (
        <Loader /> // Display loader while fetching
      ) : (
        <div className="p-5">
          <div className="text-center">
            <h3 className="text-2xl font-bold">Manage Departments</h3>
          </div>
          <div className="flex justify-between items-center">
            <input
              type="text"
              placeholder="Search By Dep Name"
              className="px-4 py-0.5 border"
              onChange={filterDepartments} // Call filter function on input change
            />
            <Link
              to="/admin-dashboard/add-department"
              className="px-4 py-2 border border-black text-black bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
            >
              Add New Department
            </Link>
          </div>
          <div className="mt-5">
            <DataTable columns={columns} data={filteredDepartments} pagination />
          </div>
        </div>
      )}
    </>
  );
};

export default DepartmentList;
