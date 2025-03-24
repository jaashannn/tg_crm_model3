import React, { useState, useEffect } from "react";
import axios from "axios";
import Loader from "../Loading/Loader";
import { toast } from "react-hot-toast";
import { useLocation } from "react-router-dom";

const BulkAssignLeads = () => {
  const [employees, setEmployees] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [priority, setPriority] = useState("");
  const [deadline, setDeadline] = useState("");
  const [leadIds, setLeadIds] = useState([]); // For bulk assignment

  const location = useLocation(); // For bulk lead IDs
  const apiUrl = import.meta.env.VITE_API_URL;

  // Load lead IDs for bulk assignment
  useEffect(() => {
    console.log("Received lead IDs from location:", location.state?.leadIds);
    if (location.state?.leadIds) {
      setLeadIds(location.state.leadIds);
    }
  }, [location]);

  // Fetch Employees
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/employee`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        if (response.data.success) {
          setEmployees(response.data.employees);
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
        toast.error("Failed to load employees. Please try again later.");
      }
    };

    fetchEmployees();
  }, []);

  // Handle Bulk Lead Assignment
  const handleBulkAssignTask = async (e) => {
    e.preventDefault();

    if (!selectedEmployee || !taskDescription || !priority || !deadline) {
      toast.error("Please fill all the required fields.");
      return;
    }

    if (new Date(deadline) < new Date()) {
      toast.error("Deadline cannot be in the past.");
      return;
    }

    setIsSubmitting(true);

    try {
      const endpoint = `${apiUrl}/api/task/bulk-assign`;
      const payload = {
        employeeId: selectedEmployee,
        leadIds,
        description: taskDescription,
        priority,
        deadline,
      };

      console.log("Sending request to:", endpoint);
      console.log("Payload:", payload);

      const response = await axios.post(endpoint, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        setSelectedEmployee("");
        setTaskDescription("");
        setPriority("");
        setDeadline("");
        setLeadIds([]); // Clear bulk lead IDs
      } else {
        toast.error(response.data.message || "Unknown error occurred.");
      }
    } catch (error) {
      console.error("Error assigning task:", error);
      toast.error("Failed to assign task. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-md shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Bulk Assign Leads</h2>

      <form onSubmit={handleBulkAssignTask}>
        {/* Employee Selection */}
        <div className="mb-6">
          <label htmlFor="employee" className="block text-lg font-semibold mb-2">
            Select Employee
          </label>
          <select
            id="employee"
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>
              -- Select Employee --
            </option>
            {employees.map((employee) => (
              <option key={employee._id} value={employee._id}>
                {employee.userId.name} - {employee.employeeId} - {employee.designation}
              </option>
            ))}
          </select>
        </div>

        {/* Task Description */}
        <div className="mb-6">
          <label htmlFor="description" className="block text-lg font-semibold mb-2">
            Task Description
          </label>
          <textarea
            id="description"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter task details here..."
          ></textarea>
        </div>

        {/* Priority */}
        <div className="mb-6">
          <label htmlFor="priority" className="block text-lg font-semibold mb-2">
            Priority
          </label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>
              -- Select Priority --
            </option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        {/* Deadline */}
        <div className="mb-6">
          <label htmlFor="deadline" className="block text-lg font-semibold mb-2">
            Deadline
          </label>
          <input
            type="datetime-local"
            id="deadline"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md font-semibold text-lg ${
            isSubmitting ? "opacity-50" : "hover:bg-blue-700 transition duration-200"
          }`}
        >
          {isSubmitting ? "Assigning Leads..." : "Assign Leads"}
        </button>
      </form>

      {isSubmitting && <Loader />}
    </div>
  );
};

export default BulkAssignLeads;