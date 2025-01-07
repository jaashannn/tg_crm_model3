import React from 'react';

// Dummy data for deals
const dummyDeals = [
  {
    id: 1,
    dealName: "Website Redesign",
    clientName: "Tech Solutions",
    amount: "$10,000",
    stage: "Negotiation",
    owner: "Alice Johnson",
    closingDate: "2024-12-30",
  },
  {
    id: 2,
    dealName: "SEO Services",
    clientName: "Growth Co.",
    amount: "$5,000",
    stage: "Prospecting",
    owner: "Bob Smith",
    closingDate: "2024-12-20",
  },
  {
    id: 3,
    dealName: "App Development",
    clientName: "Innovate Ltd.",
    amount: "$25,000",
    stage: "Closed-Won",
    owner: "John Doe",
    closingDate: "2024-11-15",
  },
];

const Deals = () => {
  return (
    <div className="deals-page">
      <div className="header flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Deals</h1>
        <button className="create-deal-btn bg-gradient-to-r from-teal-500 to-indigo-500 text-white font-semibold py-2 px-4 rounded hover:shadow-md">
          Create New Deal
        </button>
      </div>

      <div className="deals-table-container overflow-x-auto">
        <table className="deals-table w-full border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">Deal Name</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Client Name</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Amount</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Stage</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Owner</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Closing Date</th>
            </tr>
          </thead>
          <tbody>
            {dummyDeals.map((deal) => (
              <tr key={deal.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{deal.dealName}</td>
                <td className="border border-gray-300 px-4 py-2">{deal.clientName}</td>
                <td className="border border-gray-300 px-4 py-2">{deal.amount}</td>
                <td className="border border-gray-300 px-4 py-2">{deal.stage}</td>
                <td className="border border-gray-300 px-4 py-2">{deal.owner}</td>
                <td className="border border-gray-300 px-4 py-2">{deal.closingDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Deals;
