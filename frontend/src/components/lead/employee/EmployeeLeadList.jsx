import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { columns, customStyles, conditionalRowStyles } from '../../../utils/employee/EmployeeLeadHelper';
import {
  employeeColumns as columns,
  customStyles,
  conditionalRowStyles,
  fetchEmployeeLeads,
} from '../../../utils/employee/EmployeeLeadHelper'; // Import limited columns
import DataTable from 'react-data-table-component';
import axios from 'axios';

const EmployeeLeadList = () => {
  const [leads, setLeads] = useState([]);
  const [leadLoading, setLeadLoading] = useState(false);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchLeads = async () => {
      setLeadLoading(true);
      try {
        // Fetch only leads assigned to the logged-in employee
        const response = await axios.get(`${apiUrl}/api/lead`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.data.success) {
          let sno = 1;
          const data = response.data.leads.map((lead) => ({
            _id: lead._id,
            sno: sno++,
            leadId: lead.leadId,
            name: lead.name,
            email: lead.email,
            phone: lead.phone,
            company: lead.company,
            source: lead.source,
            status: lead.status,
          }));

          setLeads(data);
          setFilteredLeads(data);
        }
      } catch (error) {
        console.error(error.message);
        if (error.response && !error.response.data.success) {
          alert(error.response.data.error);
        }
      } finally {
        setLeadLoading(false);
      }
    };

    fetchLeads();
  }, []);

  const handleFilter = (e) => {
    const records = leads.filter((lead) =>
      lead.name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredLeads(records);
  };

  const handleRowClick = (row) => {
    // Allow employees to view details only
    navigate(`/employee-dashboard/leads/${row._id}`);
  };

  if (leadLoading) {
    return <div>Loading ...</div>;
  }

  return (
    <div className="p-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold">All Leads</h3>
      </div>
      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Search By Lead Name"
          className="px-4 py-0.5 border"
          onChange={handleFilter}
        />
      </div>
      <div className="mt-6">
        <DataTable
          columns={columns} // Use limited columns
          data={filteredLeads}
          pagination
          onRowClicked={handleRowClick}
          customStyles={customStyles}
          conditionalRowStyles={conditionalRowStyles}
        />
      </div>
    </div>
  );
};

export default EmployeeLeadList;
