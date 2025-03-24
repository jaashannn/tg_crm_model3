import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { columns, customStyles, conditionalRowStyles } from '../../utils/LeadHelper';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { toast } from 'react-hot-toast';
import Loader from '../Loading/Loader';

const LeadList = () => {
  const [leads, setLeads] = useState([]);
  const [leadLoading, setLeadLoading] = useState(false);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [filterField, setFilterField] = useState('');
  const [filterQuery, setFilterQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]); // Track selected rows for bulk assignment
  const [toggleCleared, setToggleCleared] = useState(false); // Clear selected rows
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
  }, []);

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
        leads.filter((lead) =>
          lead[filterField]?.toString().toLowerCase().includes(filterQuery)
        )
      );
    } else {
      setFilteredLeads(leads);
    }
  };

  const handleRowClick = (row) => {
    navigate(`/admin-dashboard/leads/${row._id}`);
  };

  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(leads);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Leads');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'leads.xlsx');
    toast.success('Leads exported successfully!');
  };
  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = async (event) => {
      const arrayBuffer = event.target.result;
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

      const validatedData = sheetData.map((lead) => {
        // Helper function to safely trim values
        const safeTrim = (value) => {
          if (value === null || value === undefined) return ""; // Handle null/undefined
          return String(value).trim(); // Convert to string and trim
        };

        // Normalize and map Excel columns to schema fields
        return {
          leadId: lead.leadId || lead['Lead ID'] || lead['lead id'] || null,
          name: safeTrim(lead.name || lead['Name'] || lead['Full Name']),
          email: safeTrim(lead.email || lead['Email'] || lead['Email Address']).toLowerCase(),
          phone: safeTrim(lead.phone || lead['Phone'] || lead['Phone Number']),
          phone1: safeTrim(lead.phone1 || lead['Phone 1'] || lead['Additional Phone 1']),
          phone2: safeTrim(lead.phone2 || lead['Phone 2'] || lead['Additional Phone 2']),
          company: safeTrim(lead.company || lead['Company'] || lead['Company Name']),
          designation: safeTrim(lead.designation || lead['Designation'] || lead['Job Title']),
          country: safeTrim(lead.country || lead['Country']),
          timeZone: safeTrim(lead.timeZone || lead['Time Zone'] || lead['Timezone']),
          source: safeTrim(lead.source || lead['Source'] || lead['Lead Source'] || "Other"),
          status: safeTrim(lead.status || lead['Status'] || "Unassigned"),
          role: safeTrim(lead.role || lead['Role'] || "Evaluator"),
          notes: safeTrim(lead.notes || lead['Notes']),
          meetingBooked: Boolean(lead.meetingBooked || lead['Meeting Booked'] || false),
          fetchedFromWebsiteAt: lead.fetchedFromWebsiteAt || lead['Fetched From Website At'] || Date.now(),
        };
      });

      const invalidLeads = validatedData.filter(
        (lead) => !lead.email || !lead.source
      );

      if (invalidLeads.length > 0) {
        toast.error(`${invalidLeads.length} leads have missing required fields and were skipped.`);
        console.error('Invalid Leads:', invalidLeads);
      }

      const validLeads = validatedData.filter(
        (lead) => lead.email && lead.source
      );

      // Split validLeads into smaller chunks (e.g., 100 leads per batch)
      const chunkSize = 100;
      const leadChunks = [];
      for (let i = 0; i < validLeads.length; i += chunkSize) {
        leadChunks.push(validLeads.slice(i, i + chunkSize));
      }

      try {
        // Send each chunk sequentially
        for (const chunk of leadChunks) {
          const response = await axios.post(
            `${apiUrl}/api/lead/import`,
            { leads: chunk },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            }
          );

          if (response.data.success) {
            toast.success(response.data.message);
            const updatedLeads = [...leads, ...chunk];
            setLeads(updatedLeads);
            setFilteredLeads(updatedLeads);
          }
        }
      } catch (error) {
        handleError(error);
      }
    };

    reader.readAsArrayBuffer(file);
  };
  // Handle row selection for bulk assignment
  const handleRowSelected = (state) => {
    setSelectedRows(state.selectedRows);
  };

  // Clear selected rows
  const handleClearRows = () => {
    setToggleCleared(!toggleCleared);
    setSelectedRows([]);
  };

  // Navigate to bulk assign page with selected lead IDs
  const handleBulkAssign = () => {
    if (selectedRows.length === 0) {
      toast.error('Please select at least one lead to assign.');
      return;
    }
    const leadIds = selectedRows.map((row) => row._id);
    navigate('/admin-dashboard/leads/bulk-assign', { state: { leadIds } });
  };

  const handleBulkDelete = async () => {
    if (selectedRows.length === 0) {
      toast.error('Please select at least one lead to delete.');
      return;
    }
    const leadIds = selectedRows.map((row) => row._id);
    try {
      const response = await axios.delete(`${apiUrl}/api/lead/bulk-delete`, {
        data: { leadIds }, // Ensure leadIds is sent in the request body
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.data.success) {
        toast.success(response.data.message);
        setLeads(leads.filter((lead) => !leadIds.includes(lead._id)));
        setFilteredLeads(filteredLeads.filter((lead) => !leadIds.includes(lead._id)));
        handleClearRows();
      }
    } catch (error) {
      console.error("Error deleting leads:", error);
      toast.error(error.response?.data?.error || "Failed to delete leads.");
    }
  };
  if (leadLoading) {
    return <Loader />;
  }

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      <div className="flex justify-between items-center flex-wrap">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Leads</h3>
        <div className="flex space-x-4">
      {/* Show Add, Import, and Export buttons only if no leads are selected */}
      {selectedRows.length === 0 && (
        <>
          <Link
            to="/admin-dashboard/leads/add"
            className="px-4 py-2 border border-black text-black bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
          >
            ➕ Add New Lead
          </Link>

          <label className="px-4 py-2 border border-black text-black bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer">
            📂 Import
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleImport}
              className="hidden"
            />
          </label>

          <button
            className="px-4 py-2 border border-black text-black bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleExport}
          >
            📤 Export
          </button>
        </>
      )}

      {/* Show Assign and Delete buttons only if leads are selected */}
      {selectedRows.length > 0 && (
        <>
          <button
            className="px-4 py-2 border border-black text-black bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleBulkAssign}
          >
            ✅ Assign
          </button>
          <button
            className="px-4 py-2 border border-black text-black bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleBulkDelete}
          >
            🗑️ Delete
          </button>
        </>
      )}
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
          selectableRows // Enable row selection
          onSelectedRowsChange={handleRowSelected}
          clearSelectedRows={toggleCleared}
        />
      </div>
    </div>
  );
};

export default LeadList;