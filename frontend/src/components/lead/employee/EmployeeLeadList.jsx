import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { columns, customStyles, conditionalRowStyles } from '../../../utils/LeadHelper';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Loader from '../../Loading/Loader';
import { useAuth } from '../../../context/AuthContext'; // Import useAuth to get the logged-in employee

const EmployeeLeadList = () => {
  const [leads, setLeads] = useState([]);
  const [leadLoading, setLeadLoading] = useState(false);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [filterField, setFilterField] = useState('');
  const [filterQuery, setFilterQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { user } = useAuth(); // Get the logged-in employee
  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchLeads = async () => {
      setLeadLoading(true);
      try {
        const response = await axios.get(`${apiUrl}/api/lead`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.data.success) {
          let sno = 1;
          const data = response.data.leads // Filter by assignedTo
            .map((lead) => ({
              _id: lead._id,
              sno: sno++,
              leadId: lead.leadId,
              name: lead.name,
              email: lead.email,
              phone: lead.phone,
              company: lead.company,
              source: lead.source,
              status: lead.status,
              createdAt: lead.createdAt,
            }));

          setLeads(data);
          setFilteredLeads(data);
          toast.success('Leads loaded successfully!');
        }
      } catch (error) {
        handleError(error);
      } finally {
        setLeadLoading(false);
      }
    };

    fetchLeads();
  }, [user._id]); // Re-fetch leads when the user ID changes

  useEffect(() => {
    const darkModeEnabled = document.documentElement.classList.contains('dark');
    setIsDarkMode(darkModeEnabled);
  }, []);

  const handleError = (error) => {
    console.error(error);
    const errorMessage = error.response?.data?.error || 'Failed to load leads';
    toast.error(errorMessage);
  };

  const handleFilterChange = (e) => {
    setFilterField(e.target.value);
  };

  const handleQueryChange = (e) => {
    setFilterQuery(e.target.value.toLowerCase());
  };

  const applyFilter = () => {
    if (filterField && filterQuery) {
      setFilteredLeads(
        leads.filter((lead) =>lead[filterField]?.toString().toLowerCase().includes(filterQuery)) );
    } else {
      setFilteredLeads(leads);
    }
  };

  const handleRowClick = (row) => {
    navigate(`/employee-dashboard/leads/${row._id}`); // Redirect to lead details page
  };

  if (leadLoading) {
    return <Loader />;
  }

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      <div className="flex justify-between items-center flex-wrap">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Leads</h3>
        <div className="flex space-x-4">
          <Link
            to="/employee-dashboard/leads/add"
            className="px-4 py-2 border border-black text-black bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
          >
            ➕ Add New Lead
          </Link>
        </div>
      </div>

      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center space-x-2">
          <select
            className="px-4 py-2 border border-black text-black bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
            value={filterField}
            onChange={handleFilterChange}
          >
            <option value="">Select Filter</option>
            <option value="name">Name</option>
            <option value="email">Email</option>
            <option value="phone">Mobile Number</option>
            <option value="company">Company</option>
          </select>
          <input
            type="text"
            placeholder="Enter Query"
            className="px-4 py-2 border border-black text-black bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
            value={filterQuery}
            onChange={handleQueryChange}
          />
          <button
            className="px-4 py-2 border border-black text-black bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
            onClick={applyFilter}
          >
            🔍 Apply Filter
          </button>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto">
        <DataTable
          columns={columns}
          data={filteredLeads}
          pagination
          paginationPerPage={100}
          paginationRowsPerPageOptions={[10, 30, 50, 100]}
          onRowClicked={handleRowClick}
          customStyles={customStyles}
          conditionalRowStyles={conditionalRowStyles}
        />
      </div>
    </div>
  );
};

export default EmployeeLeadList;