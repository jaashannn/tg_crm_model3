import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import 'chart.js/auto';

// Dummy data for charts and reports
const dummyReports = [
  {
    id: 1,
    reportName: "Monthly Sales Report",
    createdBy: "Admin",
    creationDate: "2024-11-30",
  },
  {
    id: 2,
    reportName: "Employee Performance",
    createdBy: "HR",
    creationDate: "2024-12-05",
  },
];

const barChartData = {
  labels: ["January", "February", "March", "April", "May"],
  datasets: [
    {
      label: "Revenue ($)",
      backgroundColor: ["#3DD1B4", "#393091", "#ef7c8e", "#b6e2d3", "#726BAB"],
      data: [12000, 15000, 10000, 20000, 18000],
    },
  ],
};

const pieChartData = {
  labels: ["Closed-Won", "Closed-Lost", "Negotiation", "Prospecting"],
  datasets: [
    {
      label: "Deals Distribution",
      backgroundColor: ["#3DD1B4", "#ef7c8e", "#726BAB", "#b6e2d3"],
      data: [30, 20, 25, 25],
    },
  ],
};

const Reports = () => {
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Reports Summary", 10, 10);
    doc.text("This is a dummy PDF report for demonstration purposes.", 10, 20);
    doc.save("report.pdf");
  };

  return (
    <div className="reports-page p-6">
      <div className="header flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Reports</h1>
        <button
          onClick={downloadPDF}
          className="download-btn bg-gradient-to-r from-teal-500 to-indigo-500 text-white font-semibold py-2 px-4 rounded hover:shadow-md"
        >
          Download Report
        </button>
      </div>

      <div className="charts-section grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bar-chart p-4 shadow bg-white rounded">
          <h2 className="text-lg font-semibold mb-4">Monthly Revenue</h2>
          <Bar data={barChartData} />
        </div>
        <div className="pie-chart p-4 shadow bg-white rounded">
          <h2 className="text-lg font-semibold mb-4">Deals Distribution</h2>
          <Pie data={pieChartData} />
        </div>
      </div>

      <div className="reports-table-container overflow-x-auto">
        <table className="reports-table w-full border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">Report Name</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Created By</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Creation Date</th>
            </tr>
          </thead>
          <tbody>
            {dummyReports.map((report) => (
              <tr key={report.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{report.reportName}</td>
                <td className="border border-gray-300 px-4 py-2">{report.createdBy}</td>
                <td className="border border-gray-300 px-4 py-2">{report.creationDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;
