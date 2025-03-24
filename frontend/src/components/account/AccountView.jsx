import React, { useEffect, useState } from "react";
import { useParams, useNavigate,Link } from "react-router-dom";
import axios from "axios";
import { FaPencilAlt } from "react-icons/fa";

const AccountView = () => {
  const { id } = useParams();
  const [account, setAccount] = useState(null);
  const [accountLeads, setAccountLeads] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [leads, setLeads] = useState([]);
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchAccountAndLeads = async () => {
      try {
        const accountResponse = await axios.get(`${apiUrl}/api/accounts/${id}`);
        setAccount(accountResponse.data);
        setFormData(accountResponse.data);

          // Fetch detailed information for each lead in the account's leads array
          const leadIds = accountResponse.data.leads;
            // Use a GET request with query parameters to fetch leads
            const leadsResponse = await axios.post(`${apiUrl}/api/lead/account-leads`, {
              leadIds: leadIds,  // Pass leadIds as a comma-separated string
            });
            setAccountLeads(leadsResponse.data);
          
   
        setLeads(leadsResponse.data);
      } catch (error) {
        console.error("Error fetching account or leads:", error);
      }
    };
    fetchAccountAndLeads();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSave = async () => {
    try {
      await axios.put(`${apiUrl}/api/accounts/${id}`, formData);
      setAccount(formData);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating account details:", error);
    }
  };

  return (
    <div className="w-full h-screen flex bg-gray-100 p-6">
      {account ? (
        <div className="flex w-full gap-6">
          <div className="w-1/2 bg-white shadow-lg rounded-xl p-6 flex flex-col gap-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="text-2xl font-semibold text-gray-900">Account Details</h2>
              <div className="flex items-center gap-4">
                {!isEditing && (
              <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 border border-black text-black bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 flex items-center"
            >
               <FaPencilAlt className="w-5 h-5" />
            </button>
            
                )}
                <button
                  onClick={() => navigate("/admin-dashboard/accounts")}
                  className="px-4 py-2 border border-black text-black bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
                >
                   Back
                </button>

              </div>
            </div>
            {isEditing ? (
              <div className="space-y-4">
                {[
                  "companyName",
                  "website",
                  "companyLinkedin",
                  "employeeSize",
                  "revenue",
                  "industry",
                ].map((field) => (
                  <input
                    key={field}
                    type="text"
                    name={field}
                    placeholder={field.replace(/([A-Z])/g, " $1").trim()}
                    value={formData[field] || ""}
                    onChange={handleInputChange}
                    className="border rounded-lg p-3 w-full"
                  />
                ))}
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="isTargetAccount"
                    checked={formData.isTargetAccount || false}
                    onChange={handleInputChange}
                  />
                  Target Account
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="addToDartboard"
                    checked={formData.addToDartboard || false}
                    onChange={handleInputChange}
                  />
                  Added to Dartboard
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 border border-black text-black bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    💾 Save
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border border-black text-black bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    ❌ Cancel
                  </button>

                </div>
              </div>
            ) : (
              <div className="space-y-3 text-gray-700">
                <p><strong>Company:</strong> {account.companyName}</p>
                <p><strong>Website:</strong> <a href={account.website} className="text-blue-600 hover:underline">{account.website}</a></p>
                <p><strong>LinkedIn:</strong> <a href={account.companyLinkedin} className="text-blue-600 hover:underline">{account.companyLinkedin}</a></p>
                <p><strong>Employee Size:</strong> {account.employeeSize}</p>
                <p><strong>Revenue:</strong> {account.revenue}</p>
                <p><strong>Industry:</strong> {account.industry}</p>
                <p><strong>Target Account:</strong> {account.isTargetAccount ? "Yes" : "No"}</p>
                <p><strong>Added to Dartboard:</strong>{account.addToDartboard ? "Yes" : "No"}</p>
              </div>
            )}
          </div>
          <div className="w-1/2 bg-white shadow-lg rounded-xl p-6 flex flex-col gap-4">
            <h2 className="text-2xl font-semibold text-gray-900 border-b pb-3">Linked Leads</h2>
            {leads.length > 0 ? (
             <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-100px)]">
             {leads.map((lead) => (
               <Link
                 key={lead._id}
                 to={`/admin-dashboard/leads/${lead._id}`}
                 className="block border rounded-lg p-4 shadow-sm bg-gray-50 hover:bg-gray-100"
               >
                 <p><strong>Name:</strong> {lead.name}</p>
                 <p><strong>Email:</strong> {lead.email}</p>
                 <p><strong>Phone:</strong> {lead.phone}</p>
                 <p><strong>Status:</strong> {lead.status}</p>
               </Link>
             ))}
           </div>
            ) : (
              <p>No leads linked to this account.</p>
            )}
          </div>
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center text-xl text-gray-600">Loading account details...</div>
      )}
    </div>
  );
};

export default AccountView;
