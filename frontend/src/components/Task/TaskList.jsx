import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import Loader from '../Loading/Loader';
import { toast } from 'react-hot-toast';  // Import toast for notifications

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [taskLoading, setTaskLoading] = useState(false);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchTasks = async () => {
      setTaskLoading(true);
      try {
        const response = await axios.get(`${apiUrl}/api/task`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.data.success) {
          let sno = 1;
          const formattedTasks = response.data.tasks.map((task) => ({
            sno: sno++,
            taskId: task.taskId,
            leadName: task.lead?.name || 'N/A',
            employeeName: task.employee?.name || 'N/A',
            status: task.status || 'Pending',
          }));

          setTasks(formattedTasks);
          setFilteredTasks(formattedTasks);
        } else {
          toast.error('Failed to fetch tasks!');
        }
      } catch (error) {
        console.error('Error fetching tasks:', error.message);
        toast.error('Failed to fetch tasks. Please try again.');
      } finally {
        setTaskLoading(false);
      }
    };

    fetchTasks();
  }, [apiUrl]);

  const handleFilter = (e) => {
    const query = e.target.value.toLowerCase();
    const filtered = tasks.filter((task) =>
      task.taskId.toLowerCase().includes(query) ||
      task.leadName.toLowerCase().includes(query) ||
      task.employeeName.toLowerCase().includes(query)
    );
    setFilteredTasks(filtered);
  };

  // const handleRowClick = (row) => {
  //   navigate(`/admin-dashboard/tasks/${row.taskId}`);
  // };

  if (taskLoading) {
    return <Loader />;
  }

  return (
    <div className="p-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-4">Task Management</h3>
      </div>
      <div className="flex justify-between items-center my-4">
        <input
          type="text"
          placeholder="Search by Task ID, Lead, or Employee"
          className="px-4 py-2 border rounded w-1/3"
          onChange={handleFilter}
        />
        <Link
          to="/admin-dashboard/add-task"
          className="px-4 py-2 border border-black text-black bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
        >
          ➕ Add New Task
        </Link>

      </div>
      <div className="mt-6 shadow-lg rounded-lg overflow-hidden">
        <DataTable
          columns={[
            { name: 'S.No', selector: (row) => row.sno, sortable: true },
            { name: 'Lead', selector: (row) => row.leadName, sortable: true },
            { name: 'Employee', selector: (row) => row.employeeName, sortable: true },
            { name: 'Status', selector: (row) => row.status, sortable: true },
          ]}
          data={filteredTasks}
          pagination
          // onRowClicked={handleRowClick}
          highlightOnHover
          responsive
        />
      </div>
    </div>
  );
};

export default TaskList;
