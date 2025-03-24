import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AddDepartment = () => {
  const [department, setDepartment] = useState({
    dep_name: '',
    description: '',
  });
  const [loading, setLoading] = useState(false); // Added loading state
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDepartment({ ...department, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true during submission

    // Validate form fields
    if (!department.dep_name.trim()) {
      toast.error('Department name is required.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${apiUrl}/api/department/add`, department, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.data.success) {
        toast.success('Department added successfully!');
        navigate('/admin-dashboard/departments');
      } else {
        toast.error('Failed to add department.');
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.error || 'An error occurred.');
      } else {
        toast.error('Network error. Please try again later.');
      }
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md w-96">
      <h2 className="text-2xl font-bold mb-6">Add New Department</h2>
      <form onSubmit={handleSubmit}>
        {/* Department Name Input */}
        <div>
          <label htmlFor="dep_name" className="text-sm font-medium text-gray-700">
            Department Name
          </label>
          <input
            type="text"
            name="dep_name"
            value={department.dep_name}
            onChange={handleChange}
            placeholder="Department Name"
            className="mt-1 w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Description Input */}
        <div className="mt-3">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            value={department.description}
            onChange={handleChange}
            placeholder="Description"
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            rows="4"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading} // Disable button during loading
          className="px-4 py-1 my-2 border border-black text-black bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
        >
          {loading ? 'Adding...' : 'Add Department'}
        </button>
      </form>
    </div>
  );
};

export default AddDepartment;