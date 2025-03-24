import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import AccountForm from "./AccountForm";
import toast, { Toaster } from "react-hot-toast";

const Account = () => {
  const [accounts, setAccounts] = useState([]);
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [filterField, setFilterField] = useState("");
  const [filterQuery, setFilterQuery] = useState("");

  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${apiUrl}/api/accounts`);
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        setAccounts(data);
        setFilteredAccounts(data);
      } catch (err) {
        setError(err.message);
        toast.error("Failed to fetch accounts data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  const handleFormSubmit = (newAccount) => {
    setAccounts((prev) => [...prev, newAccount]);
    setFilteredAccounts((prev) => [...prev, newAccount]);
    setShowForm(false);
  };

  const handleViewDetails = (accountId) => {
    navigate(`/admin-dashboard/account/${accountId}`); // Navigate to the account details page
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


    

      {/* Form */ }
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

  {/* Table */ }
  <div className="overflow-x-auto">
    <table className="w-full border-collapse border border-gray-200">
      <thead className="bg-gray-100">
        <tr>
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
              colSpan="3"
              className="border border-gray-300 px-4 py-2 text-center text-gray-600"
            >
              Loading...
            </td>
          </tr>
        ) : error ? (
          <tr>
            <td
              colSpan="3"
              className="border border-gray-300 px-4 py-2 text-center text-red-600"
            >
              {error}
            </td>
          </tr>
        ) : filteredAccounts.length > 0 ? (
          filteredAccounts.map((account) => (
            <tr
              key={account._id}
              className="hover:bg-gray-50 cursor-pointer"
              onClick={() => handleViewDetails(account._id)}
            >
              <td className="border border-gray-300 px-4 py-2">
                {account.companyName}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {account.companyLinkedin}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {account.website}
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td
              colSpan="3"
              className="border border-gray-300 px-4 py-2 text-center text-gray-600"
            >
              No accounts available.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
    </div >
  );
};

export default Account;
