import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const apiUrl = import.meta.env.VITE_API_URL;

// Centralized Axios instance
const axiosInstance = axios.create({
  baseURL: apiUrl,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

// Columns configuration for a table
export const columns = [
  {
    name: "S No",
    selector: (row) => row.sno,
    width: "70px",
  },
  {
    name: "Name",
    selector: (row) => row.name,
    sortable: true,
    width: "100px",
  },
  {
    name: "Image",
    selector: (row) => row.profileImage,
    width: "90px",
  },
  {
    name: "Department",
    selector: (row) => row.dep_name,
    width: "120px",
  },
  {
    name: "DOB",
    selector: (row) => row.dob,
    sortable: true,
    width: "130px",
  },
  {
    name: "Action",
    selector: (row) => row.action,
    center: true,
  },
];

// Fetch all departments
export const fetchDepartments = async () => {
  try {
    const response = await axiosInstance.get("/api/department");
    if (response.data.success) {
      return response.data.departments;
    }
  } catch (error) {
    const errorMessage = error.response?.data?.error || "Failed to fetch departments.";
    toast.error(errorMessage);
  }
  return [];
};

// Fetch employees for a specific department
export const getEmployees = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/employee/department/${id}`);
    if (response.data.success) {
      return response.data.employees;
    }
  } catch (error) {
    const errorMessage = error.response?.data?.error || "Failed to fetch employees.";
    toast.error(errorMessage);
  }
  return [];
};

// Buttons for employee actions
export const EmployeeButtons = ({ Id }) => {
  const navigate = useNavigate();

  return (
    <div className="flex space-x-3">
<button
  className="px-4 py-2 border border-black text-black bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
  onClick={() => navigate(`/admin-dashboard/employees/${Id}`)}
>
  View
</button>
<button
  className="px-4 py-2 border border-black text-black bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
  onClick={() => navigate(`/admin-dashboard/employees/edit/${Id}`)}
>
   Edit
</button>
<button
  className="px-4 py-2 border border-black text-black bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
  onClick={() => navigate(`/admin-dashboard/employees/salary/${Id}`)}
>
   Salary
</button>
<button
  className="px-4 py-2 border border-black text-black bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
  onClick={() => navigate(`/admin-dashboard/employees/leaves/${Id}`)}
>
   Leave
</button>

    </div>
  );
};
