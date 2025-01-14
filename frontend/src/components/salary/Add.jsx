import React, { useEffect, useState } from "react";
import { fetchDepartments, getEmployees } from "../../utils/EmployeeHelper";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const AddSalary = () => {
  const [salary, setSalary] = useState({
    employeeId: "",
    basicSalary: 0,
    allowances: 0,
    deductions: 0,
    payDate: "",
  });
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  // Fetch all departments on component mount
  useEffect(() => {
    const getDepartments = async () => {
      try {
        const departments = await fetchDepartments();
        setDepartments(departments);
      } catch (error) {
        toast.error("Failed to fetch departments.");
      }
    };
    getDepartments();
  }, []);

  // Fetch employees based on selected department
  const handleDepartmentChange = async (e) => {
    try {
      const employees = await getEmployees(e.target.value);
      setEmployees(employees);
    } catch (error) {
      toast.error("Failed to fetch employees.");
    }
  };

  // Handle input changes for salary details
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSalary((prevData) => ({ ...prevData, [name]: value }));
  };

  // Submit the salary details
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${apiUrl}/api/salary/add`,
        salary,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.success) {
        toast.success("Salary added successfully.");
        navigate("/admin-dashboard/employees");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.error || "An error occurred while adding salary."
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-6">Add Salary</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Department Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Department
            </label>
            <select
              name="department"
              onChange={handleDepartmentChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            >
              <option value="">Select Department</option>
              {departments.map((dep) => (
                <option key={dep._id} value={dep._id}>
                  {dep.dep_name}
                </option>
              ))}
            </select>
          </div>

          {/* Employee Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Employee
            </label>
            <select
              name="employeeId"
              onChange={handleChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            >
              <option value="">Select Employee</option>
              {employees.map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.employeeId}
                </option>
              ))}
            </select>
          </div>

          {/* Basic Salary Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Basic Salary
            </label>
            <input
              type="number"
              name="basicSalary"
              value={salary.basicSalary}
              onChange={handleChange}
              placeholder="Basic Salary"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Allowances Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Allowances
            </label>
            <input
              type="number"
              name="allowances"
              value={salary.allowances}
              onChange={handleChange}
              placeholder="Allowances"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Deductions Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Deductions
            </label>
            <input
              type="number"
              name="deductions"
              value={salary.deductions}
              onChange={handleChange}
              placeholder="Deductions"
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Pay Date Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Pay Date
            </label>
            <input
              type="date"
              name="payDate"
              value={salary.payDate}
              onChange={handleChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Salary
        </button>
      </form>
    </div>
  );
};

export default AddSalary;
