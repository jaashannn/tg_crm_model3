import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import AccountForm from "./AccountForm";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

const Account = () => {
  const [accounts, setAccounts] = useState([]);
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [filterField, setFilterField] = useState("");
  const [filterQuery, setFilterQuery] = useState("");
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [showSelectionOptions, setShowSelectionOptions] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${apiUrl}/api/accounts`);
        setAccounts(response.data);
        setFilteredAccounts(response.data);
      } catch (err) {
        setError(err.message);
        toast.error("Failed to fetch accounts data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  useEffect(() => {
    setShowSelectionOptions(selectedAccounts.length > 0);
  }, [selectedAccounts]);

  const handleFormSubmit = (newAccount) => {
    setAccounts((prev) => [...prev, newAccount]);
    setFilteredAccounts((prev) => [...prev, newAccount]);
    setShowForm(false);
  };

  const handleViewDetails = (accountId) => {
    navigate(`/admin-dashboard/account/${accountId}`);
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  const handleFilterChange = (e) => {
    setFilterField(e.target.value);
  };

  const handleQueryChange = (e) => {
    setFilterQuery(e.target.value.toLowerCase());
  };

  const applyFilter = () => {
    if (filterField && filterQuery) {
      setFilteredAccounts(
        accounts.filter((account) =>
          account[filterField]?.toString().toLowerCase().includes(filterQuery)
        )
      );
    } else {
      setFilteredAccounts(accounts);
    }
  };

  const toggleSelectAll = () => {
    if (selectedAccounts.length === filteredAccounts.length) {
      setSelectedAccounts([]);
    } else {
      setSelectedAccounts(filteredAccounts.map(account => account._id));
    }
  };

  // const toggleRandomSelect = () => {
  //   if (selectedAccounts.length > 0) {
  //     setSelectedAccounts([]);
  //   } else {
  //     const randomCount = Math.max(1, Math.floor(filteredAccounts.length / 2));
  //     const shuffled = [...filteredAccounts].sort(() => 0.5 - Math.random());
  //     setSelectedAccounts(shuffled.slice(0, randomCount).map(account => account._id));
  //   }
  // };

  const toggleAccountSelection = (accountId) => {
    setSelectedAccounts(prev =>
      prev.includes(accountId)
        ? prev.filter(id => id !== accountId)
        : [...prev, accountId]
    );
  };

  const handleAddToTarget = async () => {
    try {
      const response = await axios.put(`${apiUrl}/api/accounts/bulk/target`, {
        accountIds: selectedAccounts
      });
      toast.success(response.data.message);
      // Optionally refresh accounts or update local state
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add accounts to target');
      console.error(err);
    }
  };

  const handleAddToDartboard = async () => {
    try {
      const response = await axios.put(`${apiUrl}/api/accounts/bulk/dartboard`, {
        accountIds: selectedAccounts
      });
      toast.success(response.data.message);
      // Optionally refresh accounts or update local state
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add accounts to dartboard');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Toaster position="top-center" reverseOrder={false} />

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Accounts</h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 border border-black text-black bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
        >
          Create Account
        </button>
      </div>

      {/* Filter Section */}
      <div className="flex items-center space-x-4 mb-4">
        <select
          className="px-4 py-2 border border-black text-black bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
          value={filterField}
          onChange={handleFilterChange}
        >
          <option value="">Select Filter</option>
          <option value="companyName">Company Name</option>
          <option value="companyLinkedin">Company LinkedIn</option>
          <option value="website">Website</option>
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

      {/* Selection Controls */}
      <div className="flex items-center space-x-4 mb-4">
        <button
          onClick={toggleSelectAll}
          className="px-4 py-2 border border-black text-black bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
        >
          {selectedAccounts.length === filteredAccounts.length ? "Deselect All" : "Select All"}
        </button>
        
        {showSelectionOptions && (
          <div className="flex space-x-2">
            <button
              onClick={handleAddToTarget}
              className="px-4 py-2 border border-green-600 text-green-600 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
            >
              Add to Target
            </button>
            <button
              onClick={handleAddToDartboard}
              className="px-4 py-2 border border-blue-600 text-blue-600 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
            >
              Add to Dartboard
            </button>
          </div>
        )}
      </div>

      {/* Form */}
      <CSSTransition
        in={showForm}
        timeout={300}
        classNames="slide"
        unmountOnExit
      >
        <div className="absolute top-20 right-5 bg-white shadow-md rounded-lg p-4">
          <AccountForm onSubmit={handleFormSubmit} onCancel={handleCancel} />
        </div>
      </CSSTransition>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left w-8">
                <input
                  type="checkbox"
                  checked={selectedAccounts.length === filteredAccounts.length && filteredAccounts.length > 0}
                  onChange={toggleSelectAll}
                  className="cursor-pointer"
                />
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Company Name
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Company LinkedIn
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Website
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan="4"
                  className="border border-gray-300 px-4 py-2 text-center text-gray-600"
                >
                  Loading...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td
                  colSpan="4"
                  className="border border-gray-300 px-4 py-2 text-center text-red-600"
                >
                  {error}
                </td>
              </tr>
            ) : filteredAccounts.length > 0 ? (
              filteredAccounts.map((account) => (
                <tr
                  key={account._id}
                  className="hover:bg-gray-50"
                >
                  <td 
                    className="border border-gray-300 px-4 py-2 text-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      checked={selectedAccounts.includes(account._id)}
                      onChange={() => toggleAccountSelection(account._id)}
                      className="cursor-pointer"
                    />
                  </td>
                  <td 
                    className="border border-gray-300 px-4 py-2 cursor-pointer"
                    onClick={() => handleViewDetails(account._id)}
                  >
                    {account.companyName}
                  </td>
                  <td 
                    className="border border-gray-300 px-4 py-2 cursor-pointer"
                    onClick={() => handleViewDetails(account._id)}
                  >
                    {account.companyLinkedin}
                  </td>
                  <td 
                    className="border border-gray-300 px-4 py-2 cursor-pointer"
                    onClick={() => handleViewDetails(account._id)}
                  >
                    {account.website}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="border border-gray-300 px-4 py-2 text-center text-gray-600"
                >
                  No accounts available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Account;