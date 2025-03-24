import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const apiUrl = import.meta.env.VITE_API_URL;

// Define columns for the DataTable
export const columns = [
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
    name: "Company",
    selector: (row) => row.company,
    width: "180px",
  },
  {
    name: "Action",
    cell: (row) => <LeadButtons Id={row._id} />, // Use LeadButtons for action buttons
  },
];

// Custom styles for DataTable
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

// Conditional row styles for dark mode
export const conditionalRowStyles = [
  {
    when: () => document.documentElement.classList.contains("dark"), // Check dark mode
    style: {
      backgroundColor: "#1f2937", // Tailwind gray-800
      color: "#ffffff", // White text in dark mode
      "&:hover": {
        backgroundColor: "#374151", // Tailwind gray-700
      },
    },
  },
  {
    when: () => !document.documentElement.classList.contains("dark"), // Light mode
    style: {
      backgroundColor: "transparent",
      "&:hover": {
        backgroundColor: "#e5e7eb", // Tailwind gray-200 on hover
      },
    },
  },
];

// Fetch lead data from the backend
export const fetchLeads = async () => {
  try {
    const response = await axios.get(`${apiUrl}/api/lead`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (response.data.success) {
      return response.data.leads;
    }
  } catch (error) {
    const errorMessage = error.response?.data?.error || "Failed to fetch leads.";
    toast.error(errorMessage);
  }
  return [];
};

// Buttons for lead actions (View, Edit, Delete, etc.)
export const LeadButtons = ({ Id }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-wrap gap-3 justify-start sm:flex-row sm:gap-4 lg:flex-row lg:gap-5">
 <button
  className="px-4 py-2 border border-black text-black bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
  onClick={(e) => {
    e.stopPropagation();
    navigate(`/admin-dashboard/leads/assign/${Id}`);
  }}
>
  Assign
</button>

    </div>
  );
};
