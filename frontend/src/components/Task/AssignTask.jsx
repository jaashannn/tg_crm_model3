import React, { useState, useEffect } from "react";
import axios from "axios";
import Loader from "../Loading/Loader"
import { toast } from "react-hot-toast"; // Import toast for notifications

const AssignTask = () => {
  const [leads, setLeads] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [leadLoading, setLeadLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedLead, setSelectedLead] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [priority, setPriority] = useState("");
  const [deadline, setDeadline] = useState("");

  const apiUrl = import.meta.env.VITE_API_URL;

  // Fetch employees and leads on component mount
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

    const fetchLeads = async () => {
      setLeadLoading(true);
      try {
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
        }
      } catch (error) {
        console.error("Error fetching leads:", error);
        toast.error("Failed to load leads. Please try again later.");
      } finally {
        setLeadLoading(false);
      }
    };

    fetchEmployees();
    fetchLeads();
  }, []);

  // Handle task assignment
  const handleAssignTask = async (e) => {
    e.preventDefault();
    if (!selectedEmployee || !taskDescription || !priority || !deadline) {
      toast.error("Please fill all the required fields.");
      return;
    }
  
    // Ensure that the deadline is not in the past
    if (new Date(deadline) < new Date()) {
      toast.error("Deadline cannot be in the past.");
      return;
    }
  
    setIsSubmitting(true);
    try {
      // Assign the task
      const response = await axios.post(
        `${apiUrl}/api/task/add-task`,
        {
          employeeId: selectedEmployee,
          leadId: selectedLead || null, // Lead is optional
          description: taskDescription,
          priority,
          deadline,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
  
      console.log(selectedEmployee )
      if (response.data.success) {
        toast.success("Task successfully assigned!");
  
        // Send a notification to the employee
        await axios.post(
          `${apiUrl}/api/notifications/add`,
          {
            employeeId: selectedEmployee,
            message: `New Task Assigned: ${taskDescription}`,
          },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
  
        setSelectedEmployee("");
        setSelectedLead("");
        setTaskDescription("");
        setPriority("");
        setDeadline("");
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
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Assign Task
      </h2>

      <form onSubmit={handleAssignTask}>
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

        {/* Lead Selection */}
        <div className="mb-6">
          <label htmlFor="lead" className="block text-lg font-semibold mb-2">
            Select Lead (Optional)
          </label>
          <select
            id="lead"
            value={selectedLead}
            onChange={(e) => setSelectedLead(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- None --</option>
            {leads.map((lead) => (
              <option key={lead._id} value={lead._id}>
                {lead.name} - {lead.company}
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
          className="px-4 py-2 w-full border border-black text-black bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "⏳ Assigning Task..." : "📋 Assign Task"}
        </button>

      </form>

      {leadLoading && (
        <Loader />
      )}
    </div>
  );
};

export default AssignTask;
