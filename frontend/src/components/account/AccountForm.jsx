import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";


const AccountForm = ({ onSubmit, onCancel }) => {
  const apiUrl = import.meta.env.VITE_API_URL
  const [formData, setFormData] = useState({
    companyName: "",
    website: "",
    companyLinkedin: "",
    employeeSize: "",
    revenue: "",
    industry: "",
    addToDartboard: false,
    isTargetAccount: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${apiUrl}/api/accounts`,
        formData
      );
      toast.success("Account created successfully!");
      onSubmit(formData); // Pass the data to parent
      setFormData({
        companyName: "",
        website: "",
        companyLinkedin: "",
        employeeSize: "",
        revenue: "",
        industry: "",
        addToDartboard: false,
        isTargetAccount: false,
      });
    } catch (error) {
      console.error("Error creating account:", error);
      toast.error("Failed to create account.");
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-3xl">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
        Create Account
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Company Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Company Name
            </label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Website */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Website
            </label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Company LinkedIn */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Company LinkedIn URL
            </label>
            <input
              type="url"
              name="companyLinkedin"
              value={formData.companyLinkedin}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Employee Size */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Employee Size
            </label>
            <input
              type="number"
              name="employeeSize"
              value={formData.employeeSize}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Revenue */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Revenue
            </label>
            <input
              type="text"
              name="revenue"
              value={formData.revenue}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Industry */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Industry
            </label>
            <input
              type="text"
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>

        {/* Checkboxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              name="addToDartboard"
              checked={formData.addToDartboard}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label className="ml-2 text-sm text-gray-700">
              Add to Dartboard
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="isTargetAccount"
              checked={formData.isTargetAccount}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label className="ml-2 text-sm text-gray-700">
              Is Target Account
            </label>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between items-center">
          <button
            type="submit"
            className="px-4 py-2 border border-black text-black bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
          >
            📩 Submit
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-black text-black bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
          >
            ❌ Cancel
          </button>

        </div>
      </form>
    </div>
  );
};

export default AccountForm;
