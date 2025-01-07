import React, { useState } from 'react';

const ViewTask = ({ task, onNext, onSkip, onComplete }) => {
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState(task?.status || 'Pending'); // Default status

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    // Logic for updating status will go here later
  };

  return (
    <div className="container mx-auto py-12 px-4">
      {/* Task Overview */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8 p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Task Overview</h2>
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-4">
            <div><strong className="text-gray-700">Task ID:</strong> {task?.taskId || 'N/A'}</div>
            <div><strong className="text-gray-700">Lead Name:</strong> {task?.leadName || 'N/A'}</div>
            <div><strong className="text-gray-700">Description:</strong> {task?.description || 'No description'}</div>
            <div><strong className="text-gray-700">Assigned Employee:</strong> {task?.assignedEmployee?.name || 'Not Assigned'}</div>
            <div><strong className="text-gray-700">Due Date:</strong> {task?.dueDate || 'No due date'}</div>
          </div>
          <div className="space-y-4">
            <div><strong className="text-gray-700">Created On:</strong> {task?.createdOn || 'Unknown'}</div>
            <div><strong className="text-gray-700">Current Status:</strong> 
              <span className={`px-4 py-2 rounded-md ${status === 'Complete' ? 'bg-green-500 text-white' : 'bg-yellow-400 text-black'}`}>
                {status}
              </span>
            </div>
            <div><strong className="text-gray-700">Priority:</strong> {task?.priority || 'Normal'}</div>
          </div>
        </div>
      </div>

      {/* Task Engagement & History */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8 p-8">
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
            <div className="text-sm text-gray-600">{task?.testingResults || 'No results yet'}</div>
          </div>
        </div>
      </div>

      {/* Add Notes Section */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8 p-8">
        <h3 className="text-2xl font-semibold text-gray-900 mb-6">Add Notes</h3>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any important updates here..."
          className="w-full h-40 border-2 border-gray-300 rounded-md p-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Action Buttons */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden p-8 flex justify-between items-center">
        <button
          onClick={() => handleStatusChange('Pending')}
          className="px-6 py-3 bg-gray-400 text-white rounded-md font-medium transition duration-200 hover:bg-gray-500"
        >
          Mark as Pending
        </button>
        <button
          onClick={() => handleStatusChange('Complete')}
          className="px-6 py-3 bg-green-500 text-white rounded-md font-medium transition duration-200 hover:bg-green-600"
        >
          Mark as Complete
        </button>
      </div>

      {/* Task Navigation & Communication */}
      <div className="flex justify-between items-center mt-8">
        <div className="flex gap-6">
          <button
            onClick={onSkip}
            className="px-6 py-3 bg-gray-500 text-white rounded-md font-medium transition duration-200 hover:bg-gray-600"
          >
            Skip Task
          </button>
          <button
            onClick={onNext}
            className="px-6 py-3 bg-blue-600 text-white rounded-md font-medium transition duration-200 hover:bg-blue-700"
          >
            Next Task
          </button>
        </div>

        <div className="flex gap-6">
          <button className="px-6 py-3 bg-blue-500 text-white rounded-md font-medium transition duration-200 hover:bg-blue-600">
            Email Task
          </button>
          <button className="px-6 py-3 bg-green-500 text-white rounded-md font-medium transition duration-200 hover:bg-green-600">
            Call Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewTask;
