import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import axios from 'axios';

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
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        // console.log(response)

        if (response.data.success) {
          let sno = 1;
        
          console.log(response.data.tasks,"tasks")
          const data = response.data.tasks.map((task) => ({

            // _id: task._id,
            sno: sno++,
            taskId: task.taskId,
            leadName: task.lead.name,  // Assuming lead name is populated
            employeeName: task.employee.name,  // Assuming employee name is populated
            status: task.status,
            description: task.description,
            createdAt: task.createdAt,
            
          }));

          // console.log(response.data.tasks.task,"employee");
          console.log(data)

          setTasks(data);
          setFilteredTasks(data);
        }
      } catch (error) {
        console.log(error.message);
        if (error.response && !error.response.data.success) {
          alert(error.response.data.error);
        }
      } finally {
        setTaskLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleFilter = (e) => {
    const records = tasks.filter((task) =>
      task.taskId.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredTasks(records);
  };

  const handleRowClick = (row) => {
    navigate(`/admin-dashboard/tasks/${row._id}`);
  };

  if (taskLoading) {
    return <div>Loading ...</div>;
  }

  return (
    <div className="p-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold">Manage Tasks</h3>
      </div>
      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Search By Task ID"
          className="px-4 py-0.5 border"
          onChange={handleFilter}
        />
        <Link
          to="/admin-dashboard/add-task"
          className="px-4 py-1 bg-teal-600 rounded text-white"
        >
          Add New Task
        </Link>
      </div>
      <div className="mt-6">
        <DataTable
          columns={[
            { name: 'S.No', selector: row => row.sno },
            // { name: 'Task ID', selector: row => row.taskId },
            { name: 'Lead', selector: row => row.leadName },
            { name: 'Employee', selector: row => row.employeeName },
            { name: 'Status', selector: row => row.status },
            { name: 'Description', selector: row => row.description },
            { name: 'Created At', selector: row => row.createdAt },
          ]}
          data={filteredTasks}
          pagination
          onRowClicked={handleRowClick}
        />
      </div>
    </div>
  );
};

export default TaskList;
