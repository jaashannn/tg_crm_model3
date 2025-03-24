import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { columns, EmployeeButtons } from '../../utils/EmployeeHelper';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import Loader from '../Loading/Loader';
import { toast } from 'react-hot-toast'; // Import react-hot-toast

const List = () => {
  // State to store employees and loading state
  const [employees, setEmployees] = useState([]);
  const [empLoading, setEmpLoading] = useState(false);
  const [filteredEmployee, setFilteredEmployees] = useState([]); // Initialize as empty array

  const apiUrl = import.meta.env.VITE_API_URL; // API base URL from environment variables

  // Fetch employees on component mount
  useEffect(() => {
    const fetchEmployees = async () => {
      setEmpLoading(true); // Set loading state to true while fetching data
      try {
        // Fetch employee data from API
        const response = await axios.get(`${apiUrl}/api/employee`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        // Check if the response is successful and contains employee data
        if (response.data.success && Array.isArray(response.data.employees)) {
          let sno = 1;
          // Map the employee data to a format suitable for the table
          const data = response.data.employees.map((emp) => ({
            _id: emp._id,
            sno: sno++,
            dep_name: emp.department.dep_name,
            name: emp.userId.name,
            dob: new Date(emp.dob).toLocaleDateString(),
            profileImage: (
              <img width={40} className="rounded-full" src={`${apiUrl}/${emp.userId.profileImage}`} alt="profile" />
            ),
            action: <EmployeeButtons Id={emp._id} />,
          }));
          setEmployees(data); // Set employees data
          setFilteredEmployees(data); // Set filtered employees (initially same as employees)
        } else {
          toast.error('Failed to fetch employees'); // Display error notification if fetch fails
        }
      } catch (error) {
        console.error(error.message);
        // Display error message from API response if any
        if (error.response && !error.response.data.success) {
          toast.error(error.response.data.error);
        } else {
          toast.error('An error occurred while fetching employee data');
        }
      } finally {
        setEmpLoading(false); // Set loading state to false after the API call completes
      }
    };

    fetchEmployees(); // Call the fetch function
  }, [apiUrl]); // Run only once when component mounts

  // Filter employees based on search input
  const handleFilter = (e) => {
    const filtered = employees.filter((emp) =>
      emp.name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredEmployees(filtered); // Update filtered employees state
  };

  // Show loading indicator if employees are still being fetched
  if (empLoading) {
    return <Loader />;
  }

  return (
    <div className="p-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold">Manage Employee</h3>
      </div>

      {/* Search input and Add Employee button */}
      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Search By Name"
          className="px-4 py-0.5 border"
          onChange={handleFilter} // Trigger filter function on input change
        />
        <Link
          to="/admin-dashboard/add-employee"
          className="px-4 py-2 border border-black text-black bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
        >
          Add New Employee
        </Link>
      </div>

      {/* Employee data table */}
      <div className="mt-6">
        <DataTable columns={columns} data={filteredEmployee} pagination />
      </div>
    </div>
  );
};

export default List;
