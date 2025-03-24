import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Loader from '../../Loading/Loader';
import { toast } from 'react-hot-toast';

const ViewTask = ({ onNext, onComplete }) => {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [status, setStatus] = useState('Pending');
  const [taskLoading, setTaskLoading] = useState(true);
  const [taskError, setTaskError] = useState(null);

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchEmployeeTask = async () => {
      setTaskLoading(true);
      try {
        const response = await axios.get(`${apiUrl}/api/task/mytask/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (response.data.success) {
          setTask(response.data.task);
          setStatus(response.data.task.status || 'Pending');
        } else {
          setTaskError('Task not found');
        }
      } catch (error) {
        console.error('Error fetching task:', error.response?.data || error.message);
        setTaskError(error.response?.data?.error || 'Failed to fetch task.');
      } finally {
        setTaskLoading(false);
      }
    };

    fetchEmployeeTask();
  }, [id, apiUrl]);

  const handleStatusChange = async (newStatus) => {
    setStatus(newStatus);
    try {
      const response = await axios.put(
        `${apiUrl}/api/task/update-status/${id}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (response.data.success) {
        toast.success('Task status updated successfully!');
      } else {
        toast.error('Failed to update task status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update task status');
    }
  };

  if (taskLoading) {
    return <Loader />;
  }

  if (taskError) {
    return <div className="text-center text-red-500 py-8">{taskError}</div>;
  }

  return (
    <div className="container mx-auto py-12 px-4">
      {/* Task Overview */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8 p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Task Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            {/* <div>
              <strong className="text-gray-700">Task ID:</strong> {task?.taskId || 'N/A'}
            </div> */}
            <div>
              <strong className="text-gray-700">Lead Name:</strong> {task?.lead[0]?.name || 'N/A'}
            </div>
            <div>
              <strong className="text-gray-700">Description:</strong> {task?.description || 'No description'}
            </div>
            <div>
              <strong className="text-gray-700">Due Date:</strong> {task?.deadline || 'No due date'}
            </div>
          </div>
          <div className="space-y-4">
            {/* <div>
              <strong className="text-gray-700">Created On:</strong> {task?.createdOn || 'Unknown'}
            </div> */}
            <div>
              <strong className="text-gray-700">Current Status:</strong>
              <span
                className={`ml-2 px-3 py-1 rounded-full text-sm ${
                  task?.status === 'Completed'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                {task?.status}
              </span>
            </div>
            <div>
              <strong className="text-gray-700">Priority:</strong> {task?.priority || 'Normal'}
            </div>
          </div>
        </div>
      </div>

      {/* Task Engagement & History */}
      {/* <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8 p-8">
        <h3 className="text-2xl font-semibold text-gray-900 mb-6">Task Engagement & Testing</h3>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="text-gray-700">
              <strong>Engagement:</strong> {task?.engagement?.web ? 'Web' : 'Mobile'}
            </div>
            <div className="text-gray-700">
              <strong>Testing Type:</strong> {task?.testingType || 'Web Testing'}
            </div>
          </div>
          <div>
            <strong className="text-gray-700">Testing Results:</strong>
            <div className="text-sm text-gray-600 mt-1">{task?.testingResults || 'No results yet'}</div>
          </div>
        </div>
      </div> */}

      {/* Action Buttons */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden p-8 flex justify-between items-center">
        <button
          onClick={() => handleStatusChange('Pending')}
          className="px-6 py-3 border border-gray-400 text-gray-700 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
        >
          Mark as Pending
        </button>
        <button
          onClick={() => handleStatusChange('Completed')}
          className="px-6 py-3 border border-green-500 text-green-500 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
        >
          Mark as Complete
        </button>
      </div>

      {/* Task Navigation & Communication */}
      <div className="flex flex-col md:flex-row justify-between items-center mt-8 gap-4">
        <div className="flex gap-4">
          <button
            onClick={onNext}
            className="px-6 py-3 border border-blue-500 text-blue-500 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
          >
            Next Task
          </button>
        </div>

        <div className="flex gap-4">
          <button className="px-6 py-3 border border-blue-500 text-blue-500 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
            Email Task
          </button>
          <button className="px-6 py-3 border border-green-500 text-green-500 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
            Call Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewTask;