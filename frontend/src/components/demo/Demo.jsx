import React, { useState } from 'react';

const Demos = () => {
  const [demoData, setDemoData] = useState([
    {
      id: 1,
      title: "Product Overview",
      scheduledDate: "2024-12-12",
      completed: true,
      rating: 4,
      outcome: "Interested",
      nextSteps: "Follow-up in 2 days",
    },
    {
      id: 2,
      title: "Feature Deep Dive",
      scheduledDate: "2024-12-15",
      completed: false,
      rating: null,
      outcome: "Pending",
      nextSteps: "Awaiting demo",
    },
  ]);

  return (
    <div className="demos-page p-6">
      <div className="header flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Demos</h1>
      </div>

      {/* Scheduled Demos */}
      <div className="scheduled-demos mb-6 p-4 shadow bg-white rounded">
        <h2 className="text-lg font-semibold mb-4">Demos Scheduled</h2>
        <ul className="list-disc list-inside text-gray-700">
          {demoData
            .filter((demo) => !demo.completed)
            .map((demo) => (
              <li key={demo.id}>{`${demo.title} - Scheduled for ${demo.scheduledDate}`}</li>
            ))}
        </ul>
      </div>

      {/* Completed Demos */}
      <div className="completed-demos mb-6 p-4 shadow bg-white rounded">
        <h2 className="text-lg font-semibold mb-4">Demos Completed</h2>
        <ul className="list-disc list-inside text-gray-700">
          {demoData
            .filter((demo) => demo.completed)
            .map((demo) => (
              <li key={demo.id}>{`${demo.title} - Completed on ${demo.scheduledDate}`}</li>
            ))}
        </ul>
      </div>

      {/* Demo Details */}
      <div className="demo-details mb-6 p-4 shadow bg-white rounded">
        <h2 className="text-lg font-semibold mb-4">Demo Details</h2>
        <table className="w-full border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">Title</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Scheduled Date</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Completed</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Rating</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Outcome</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Next Steps</th>
            </tr>
          </thead>
          <tbody>
            {demoData.map((demo) => (
              <tr key={demo.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{demo.title}</td>
                <td className="border border-gray-300 px-4 py-2">{demo.scheduledDate}</td>
                <td className="border border-gray-300 px-4 py-2">{demo.completed ? "Yes" : "No"}</td>
                <td className="border border-gray-300 px-4 py-2">{demo.rating || "N/A"}</td>
                <td className="border border-gray-300 px-4 py-2">{demo.outcome}</td>
                <td className="border border-gray-300 px-4 py-2">{demo.nextSteps}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Demos;
