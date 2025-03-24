import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-hot-toast";

const View = () => {
  const [salaries, setSalaries] = useState([]);
  const [filteredSalaries, setFilteredSalaries] = useState([]);
  const { id } = useParams();
  const { user } = useAuth();
  const apiUrl = import.meta.env.VITE_API_URL;

  const fetchSalaries = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/salary/${id}/${user.role}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.data.success) {
        setSalaries(response.data.salary);
        setFilteredSalaries(response.data.salary);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to fetch salaries.");
    }
  };

  useEffect(() => {
    fetchSalaries();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    const filtered = salaries.filter((salary) =>
      salary.employeeId.employeeId.toLowerCase().includes(query)
    );
    setFilteredSalaries(filtered);
  };

  return (
    <div className="p-5">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold">Salary History</h2>
      </div>

      <div className="flex justify-end mb-3">
        <input
          type="text"
          placeholder="Search by Employee ID"
          className="border px-3 py-2 rounded-md"
          onChange={handleSearch}
        />
      </div>

      {filteredSalaries.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border text-sm text-left text-gray-600">
            <thead className="bg-gray-100 text-xs uppercase text-gray-700">
              <tr>
                <th className="px-6 py-3">#</th>
                <th className="px-6 py-3">Emp ID</th>
                <th className="px-6 py-3">Salary</th>
                <th className="px-6 py-3">Allowance</th>
                <th className="px-6 py-3">Deduction</th>
                <th className="px-6 py-3">Total</th>
                <th className="px-6 py-3">Pay Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredSalaries.map((salary, index) => (
                <tr key={salary._id} className="border-b">
                  <td className="px-6 py-3">{index + 1}</td>
                  <td className="px-6 py-3">{salary.employeeId.employeeId}</td>
                  <td className="px-6 py-3">{salary.basicSalary}</td>
                  <td className="px-6 py-3">{salary.allowances}</td>
                  <td className="px-6 py-3">{salary.deductions}</td>
                  <td className="px-6 py-3">{salary.netSalary}</td>
                  <td className="px-6 py-3">
                    {new Date(salary.payDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center text-gray-500">No salary records found.</div>
      )}
    </div>
  );
};

export default View;
