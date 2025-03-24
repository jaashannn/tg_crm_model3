import React from "react";
import { Link } from "react-router-dom";

// Define columns for the task table
export const taskColumns = [
  {
    name: "S.No",
    selector: (row) => row.sno,
    sortable: true,
    width: "60px",
  },
  {
    name: "Task Name",
    selector: (row) => row.name,
    sortable: true,
  },
  {
    name: "Email",
    selector: (row) => row.email,
  },
  {
    name: "Phone",
    selector: (row) => row.phone,
  },
  {
    name: "Company",
    selector: (row) => row.company,
  },
  {
    name: "Status",
    selector: (row) => row.status,
    sortable: true,
  },
  {
    name: "Actions",
    cell: (row) => <TaskButtons Id={row._id} />, // Use TaskButtons for actions
    width: "150px",
  },
];

// Task action buttons
export const TaskButtons = ({ Id }) => {
  // Function to handle task completion
  const handleComplete = (id) => {
    console.log(`Mark task ${id} as complete`);
    // You can add functionality here to update the task status in your backend
  };

  return (
    <div className="flex space-x-2">
      {/* View Task Link */}
      <Link
  to={`/employee-dashboard/task/${Id}`}
  className="px-4 py-2 border border-black text-black bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
>
  View
</Link>

<button
  onClick={() => handleComplete(Id)}
  className="px-4 py-2 border border-black text-black bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
>
  Complete
</button>

    </div>
  );
};
