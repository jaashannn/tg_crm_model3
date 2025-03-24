import { useNavigate } from "react-router-dom";

// Define columns for the DataTable
export const columns = [
  {
    name: "S No",
    selector: (row) => row.sno,
    width: "70px",
  },
  {
    name: "Emp ID",
    selector: (row) => row.employeeId,
    width: "110px",
  },
  {
    name: "Name",
    selector: (row) => row.name,
    width: "120px",
  },
  {
    name: "Leave Type",
    selector: (row) => row.leaveType,
    width: "140px",
  },
  {
    name: "Department",
    selector: (row) => row.department,
    width: "150px",
  },
  {
    name: "Days",
    selector: (row) => row.days,
    width: "80px",
  },
  {
    name: "Status",
    selector: (row) => row.status,
    width: "100px",
  },
  {
    name: "Action",
    cell: (row) => <LeaveButtons Id={row._id} />, // Use LeaveButtons for action buttons
    center: true,
  },
];

// Action Buttons for Leave Management
export const LeaveButtons = ({ Id }) => {
  const navigate = useNavigate();

  // Navigate to leave details view
  const handleView = (id) => {
    navigate(`/admin-dashboard/leaves/${id}`);
  };

  return (
    <button
    className="px-4 py-2 border border-black text-black bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
    onClick={() => handleView(Id)}
  >
    View
  </button>
  
  );
};
