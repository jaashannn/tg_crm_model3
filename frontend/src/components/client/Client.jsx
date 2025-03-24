import React, { useState } from 'react';

const Clients = () => {
  const [clients, setClients] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "johndoe@example.com",
      phone: "123-456-7890",
      status: "Active",
      createdOn: "2024-12-01",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "janesmith@example.com",
      phone: "987-654-3210",
      status: "Inactive",
      createdOn: "2024-12-05",
    },
  ]);

  return (
    <div className="clients-page p-6">
      <div className="header flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Clients</h1>
        <button
          className="add-client-btn bg-gradient-to-r from-teal-500 to-indigo-500 text-white font-semibold py-2 px-4 rounded hover:shadow-md"
        >
          Add Client
        </button>
      </div>

      <div className="clients-table-container overflow-x-auto">
        <table className="clients-table w-full border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Phone</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Created On</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{client.name}</td>
                <td className="border border-gray-300 px-4 py-2">{client.email}</td>
                <td className="border border-gray-300 px-4 py-2">{client.phone}</td>
                <td className="border border-gray-300 px-4 py-2">{client.status}</td>
                <td className="border border-gray-300 px-4 py-2">{client.createdOn}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Clients;
