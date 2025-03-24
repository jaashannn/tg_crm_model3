import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export const columns = [
  {
    name: "S No",
    selector: (row) => row.sno,
  },
  {
    name: "Department Name",
    selector: (row) => row.dep_name,
    sortable: true,
  },
  {
    name: "Action",
    selector: (row) => row.action,
  },
];

export const DepartmentButtons = ({ Id, onDepartmentDelete }) => {
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleDelete = async (id) => {
    if (window.confirm("Do you really want to delete this department?")) {
      try {
        const response = await axios.delete(`${apiUrl}/api/department/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (response.data.success) {
          toast.success("Department deleted successfully.");
          onDepartmentDelete(); // Refresh the data or trigger a re-fetch.
        }
      } catch (error) {
        toast.error(
          error.response?.data?.error || "An error occurred while deleting."
        );
      }
    }
  };

  return (
    <div className="flex space-x-3">
   <button
  className="px-4 py-2 border border-black text-black bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
  onClick={() => navigate(`/admin-dashboard/department/${Id}`)}
>
  Edit
</button>
<button
  className="px-4 py-2 border border-black text-black bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
  onClick={() => handleDelete(Id)}
>
   Delete
</button>

    </div>
  );
};
