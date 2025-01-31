import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { columns, customStyles, conditionalRowStyles } from '../../utils/LeadHelper';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { toast } from 'react-hot-toast';  // Import react-hot-toast

import Loader from '../Loading/Loader';

const LeadList = () => {
  const [leads, setLeads] = useState([]);
  const [leadLoading, setLeadLoading] = useState(false);
  const [filteredLeads, setFilteredLeads] = useState([]);
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
            createdAt: lead.createdAt,  // Include createdAt field
          }));

          setLeads(data);
          setFilteredLeads(data);
          toast.success('Leads loaded successfully!');  // Success Toast
        }
      } catch (error) {
        handleError(error);
      } finally {
        setLeadLoading(false);
      }
    };

    fetchLeads();
  }, []);

  const handleError = (error) => {
    console.error(error);
    const errorMessage = error.response?.data?.error || 'Failed to load leads';
    toast.error(errorMessage);  // Error Toast
  };

  const handleFilter = (e) => {
    const query = e.target.value.toLowerCase();
    setFilteredLeads(leads.filter((lead) => lead.name.toLowerCase().includes(query)));
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
    toast.success('Leads exported successfully!');  // Success Toast
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    const reader = new FileReader();
  
    reader.onload = async (event) => {
      const arrayBuffer = event.target.result;
      const workbook = XLSX.read(arrayBuffer, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
  
      // Validate the data
      const validatedData = sheetData.map((lead) => ({
        leadId: lead.leadId || null,
        name: lead.name || null,
        email: lead.email || null,
        phone: lead.phone || null,
        company: lead.company || null,
        source: lead.source || null,
        status: lead.status || "New",
      }));
  
      const invalidLeads = validatedData.filter(
        (lead) => !lead.leadId || !lead.name || !lead.email || !lead.source
      );
  
      if (invalidLeads.length > 0) {
        toast.error("Some leads have missing required fields. Please correct them.");  // Error Toast
        console.error("Invalid Leads:", invalidLeads);
        return;
      }
  
      try {
        const response = await axios.post(
          `${apiUrl}/api/lead/import`,
          { leads: validatedData },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
  
        if (response.data.success) {
          toast.success(response.data.message);  // Success Toast
          const updatedLeads = [...leads, ...validatedData];
          setLeads(updatedLeads);
          setFilteredLeads(updatedLeads);
        }
      } catch (error) {
        handleError(error);
      }
    };
  
    reader.readAsArrayBuffer(file);
  };

  const handleSort = (order) => {
    const sortedLeads = [...leads].sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);

      return order === 'asc' ? dateA - dateB : dateB - dateA;
    });

    setFilteredLeads(sortedLeads);
  };

  if (leadLoading) {
    return <Loader />;
  }

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      <div className="text-center">
        <h3 className="text-2xl font-bold">Manage Leads</h3>
      </div>
      <div className="flex justify-between items-center mt-4">
        <input
          type="text"
          placeholder="Search By Lead Name"
          className="px-4 py-0.5 border"
          onChange={handleFilter}
        />
        <div className="flex items-center space-x-4">
          <select
            className="border px-4 py-1 rounded"
            onChange={(e) => handleSort(e.target.value)}
          >
            <option value="asc">Sort by Created Date (Ascending)</option>
            <option value="desc">Sort by Created Date (Descending)</option>
          </select>
          <label className="px-4 py-1 bg-teal-600 rounded text-white cursor-pointer">
            Import Leads
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleImport}
              className="hidden"
            />
          </label>
          <button
            className="ml-4 px-4 py-1 bg-teal-600 rounded text-white"
            onClick={handleExport}
          >
            Export Leads
          </button>
          <Link
            to="/admin-dashboard/add-lead"
            className="ml-4 px-4 py-1 bg-teal-600 rounded text-white"
          >
            Add New Lead
          </Link>
        </div>
      </div>
      <div className="mt-6 overflow-x-auto">
        <DataTable
          columns={columns}
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

export default LeadList;
