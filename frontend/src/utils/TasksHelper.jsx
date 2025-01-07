import React from "react";
import { Link } from "react-router-dom";

// Task table columns
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
    selector: (row) => row.action,
    width: "150px",
  },
];

// Task buttons (actions for each task)
export const TaskButtons = ({ Id }) => (
  <div className="flex space-x-2">
    <Link
      to={`/employee-dashboard/task/${Id}`}
      className="px-2 py-1 bg-blue-500 text-white text-sm rounded"
    >
      View
    </Link>
    <button
      onClick={() => console.log("Mark complete", Id)}
      className="px-2 py-1 bg-green-500 text-white text-sm rounded"
    >
      Complete
    </button>
  </div>
);
