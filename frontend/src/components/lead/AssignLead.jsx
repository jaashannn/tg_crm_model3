import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast"; // Import toast

const AssignLead = () => {
  const { id } = useParams(); // Lead ID from URL
  const navigate = useNavigate();

  // State variables
  const [lead, setLead] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    // Fetch lead details and employees in parallel
    const fetchLeadDetails = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/lead/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (response.data.success) {
          setLead(response.data.lead);
          setSelectedEmployee(response.data.lead.assignedTo || ""); // Pre-select if already assigned
        }
      } catch (error) {
        console.error("Error fetching lead details:", error);
        toast.error("Failed to load lead details. Please try again later.");
      }
    };

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
      } finally {
        setLoading(false); // Stop loading once data is fetched
      }
    };

    fetchLeadDetails();
    fetchEmployees();
  }, [id]);

  // Handle lead assignment
  const handleAssignLead = async (e) => {
    e.preventDefault();
    if (!selectedEmployee) {
      toast.error("Please select an employee to assign the lead.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.put(
        `${apiUrl}/api/lead/assign/${id}`,
        { employeeId: selectedEmployee },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (response.data.success) {
        toast.success("Lead successfully assigned!"); // Use toast for success
        navigate("/admin-dashboard/leads");
      }
    } catch (error) {
      console.error("Error assigning lead:", error);
      toast.error("Failed to assign lead. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-md shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Assign Lead</h2>

      {loading ? (
        <div className="text-center text-gray-500">Loading...</div> // Display loading indicator
      ) : (
        <>
          {lead && (
            <div className="mb-8 p-4 bg-gray-100 rounded-md shadow-sm">
              <h3 className="text-xl font-semibold mb-2">Lead Information</h3>
              <p><strong>Name:</strong> {lead.name}</p>
              <p><strong>Email:</strong> {lead.email}</p>
              <p><strong>Company:</strong> {lead.company}</p>
              <p><strong>Status:</strong> {lead.status}</p>
              <p>
                <strong>Assigned To:</strong>{" "}
                {lead.assignedTo
                  ? `${lead.assignedTo.name} (${lead.assignedTo.employeeId})`
                  : "Not Assigned"}
              </p>
            </div>
          )}

          {/* Lead Assignment Form */}
          <form onSubmit={handleAssignLead}>
            <div className="mb-6">
              <label htmlFor="employee" className="block text-lg font-semibold mb-2">
                Select an Employee to Assign
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

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md font-semibold text-lg ${
                isSubmitting ? "opacity-50" : "hover:bg-blue-700 transition duration-200"
              }`}
            >
              {isSubmitting ? "Assigning..." : "Assign Lead"}
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default AssignLead;
