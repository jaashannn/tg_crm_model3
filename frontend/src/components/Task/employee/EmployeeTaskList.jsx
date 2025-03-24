import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loader from '../../Loading/Loader';

const EmployeeTaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [taskLoading, setTaskLoading] = useState(false);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchEmployeeTasks = async () => {
      setTaskLoading(true);
      try {
        const response = await axios.get(`${apiUrl}/api/task/mytask`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.data.success) {
          let sno = 1;
          console.log('Employee tasks:', response.data.tasks);
          const data = response.data.tasks.map((task) => ({
            _id: task._id,
            sno: sno++,
            taskId: task.taskId,
            leadName: task.lead[0].name || 'N/A', // Assuming lead name is populated
            status: task.status,
            description: task.description,
            createdAt: new Date(task.createdAt).toLocaleString(),
          }));

          console.log('Employee tasks:', data);

          setTasks(data);
          setFilteredTasks(data);
        }
      } catch (error) {
        console.error('Error fetching tasks:', error.message);
        if (error.response && !error.response.data.success) {
          alert(error.response.data.error);
        }
      } finally {
        setTaskLoading(false);
      }
    };

    fetchEmployeeTasks();
  }, []);

  const handleFilter = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const records = tasks.filter(
      (task) =>
        task.taskId.toLowerCase().includes(searchTerm) ||
        task.leadName.toLowerCase().includes(searchTerm)
    );
    setFilteredTasks(records);
  };

  const handleRowClick = (row) => {
    navigate(`/employee-dashboard/tasks/${row._id}`); // Redirect to task details page
  };

  const handleCall = (taskId) => {
    alert(`Calling Task ID: ${taskId}`); // Replace with actual call logic
  };

  const handleEmail = (taskId) => {
    alert(`Emailing Task ID: ${taskId}`); // Replace with actual email logic
  };

  if (taskLoading) {
    return <Loader />;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-semibold text-gray-800">My Tasks</h3>
      </div>
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search tasks by Task ID or Lead Name"
          className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full max-w-md"
          onChange={handleFilter}
        />
      </div>
      <div className="space-y-4">
        {filteredTasks.map((task) => (
          <div
            key={task._id}
            className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-6 cursor-pointer"
            onClick={() => handleRowClick(task)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-xl font-semibold text-gray-700">{task.description}</h4>
                <p className="text-gray-500 text-sm mt-1">{task.leadName}</p>
              </div>
              <div
                className={`px-3 py-1 rounded-full text-xs ${
                  task.status === 'Completed'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                {task.status}
              </div>
            </div>
            {/* <p className="text-gray-600 mt-2">{task.description}</p> */}
            <div className="flex justify-between items-center mt-4">
              <span className="text-gray-400 text-sm">{task.createdAt}</span>
              <div className="flex space-x-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCall(task.taskId);
                  }}
                  className="px-4 py-2 border border-blue-500 text-blue-500 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
                >
                  Call
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEmail(task.taskId);
                  }}
                  className="px-4 py-2 border border-green-500 text-green-500 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
                >
                  Email
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeTaskList;