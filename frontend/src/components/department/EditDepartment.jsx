import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../Loading/Loader";
import toast from "react-hot-toast"; // Import react-hot-toast for notifications

const EditDepartment = () => {
  const { id } = useParams();
  const [department, setDepartment] = useState({});
  const [depLoading, setDepLoading] = useState(false);
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL; // API base URL

  // Fetch department data when the component is mounted
  useEffect(() => {
    const fetchDepartment = async () => {
      setDepLoading(true);
      try {
        const response = await axios.get(`${apiUrl}/api/department/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.data.success) {
          setDepartment(response.data.department);
        } else {
          toast.error("Failed to fetch department data.");
        }
      } catch (error) {
        toast.error(error.response?.data?.error || "Failed to fetch department.");
      } finally {
        setDepLoading(false);
      }
    };

    fetchDepartment();
  }, [id]);

  // Handle input field change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDepartment({ ...department, [name]: value });
  };

  // Handle form submission for editing the department
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${apiUrl}/api/department/${id}`,
        department,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Department updated successfully!");
        navigate("/admin-dashboard/departments"); // Navigate to departments list
      } else {
        toast.error("Failed to update department.");
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Error updating department.");
    }
  };

  return (
    <>
      {depLoading ? (
        <Loader /> // Display loader while fetching data
      ) : (
        <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md w-96">
          <h2 className="text-2xl font-bold mb-6">Edit Department</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="dep_name" className="text-sm font-medium text-gray-700">
                Department Name
              </label>
              <input
                type="text"
                name="dep_name"
                onChange={handleChange}
                value={department.dep_name || ""}
                placeholder="Department Name"
                className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div className="mt-3">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                placeholder="Description"
                onChange={handleChange}
                value={department.description || ""}
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                rows="4"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
            >
              Edit Department
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default EditDepartment;
