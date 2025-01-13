import axios from "axios";
import { useNavigate } from "react-router-dom";

// Define columns for the Employee DataTable
export const employeeColumns = [
  {
    name: "S No",
    selector: (row) => row.sno,
    width: "70px",
  },
  {
    name: "Lead Name",
    selector: (row) => row.name,
    sortable: true,
    width: "180px",
  },
  {
    name: "Email",
    selector: (row) => row.email,
    width: "200px",
  },
  {
    name: "Phone",
    selector: (row) => row.phone,
    width: "150px",
  },
  {
    name: "Action",
    cell: (row) => <EmployeeLeadButtons Id={row._id} />, // Limited actions for employees
  },
];

// Custom styles for DataTable (reuse existing styles)
export const customStyles = {
  rows: {
    style: {
      cursor: "pointer",
      transition: "background-color 0.2s",
    },
  },
  headCells: {
    style: {
      fontWeight: "bold",
    },
  },
};

export const conditionalRowStyles = [
  {
    when: () => true,
    style: {
      cursor: "pointer",
      backgroundColor: "transparent",
      "&:hover": {
        backgroundColor: "#e5e7eb",
      },
    },
  },
];

// Function to fetch lead data assigned to the logged-in employee
export const fetchEmployeeLeads = async () => {
  let leads;
  try {
    const response = await axios.get("http://localhost:5000/api/employee/leads", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (response.data.success) {
      leads = response.data.leads;
    }
  } catch (error) {
    if (error.response && !error.response.data.success) {
      alert(error.response.data.error);
    }
  }
  return leads;
};

// Buttons with limited actions for employees
export const EmployeeLeadButtons = ({ Id }) => {
  const navigate = useNavigate();

  return (
    <div className="flex space-x-3">
      <button
        className="px-3 py-1 bg-green-600 text-white"
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/employee-dashboard/leads/${Id}`); // View only
        }}
      >
        View
      </button>
    </div>
  );
};
