import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import Modal from "react-modal";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// Modal styles
const customStyles = {
  content: {
    maxWidth: "500px",
    margin: "auto",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)",
    backgroundColor: "#ffffff",
    marginTop: "100px",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    backdropFilter: "blur(4px)",
  },
};

// Deal Stages
const stages = [
  "Demo Scheduled",
  "Demo Done",
  "POC",
  "Opportunity",
  "Negotiation",
  "Closed Won",
  "Closed Lost",
  "Nurture",
];

const ListDeals = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [count, setCount] = useState(0);
  const [formData, setFormData] = useState({
    title: "",
    stage: "Demo Scheduled",
    currentTools: "",
    crossBrowserTesting: "",
    automationPercentage: "",
    testingTeam: "",
    challenges: "",
    ciCdChallenges: "",
    goals: "",
    technicalEnvironment: "",
    budgetAllocated: "",
    trialSuccessMetrics: "",
    collaborationProcess: "",
    price: "", // Add price field
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // Fetch all accounts
  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/api/accounts`);
      setAccounts(response.data);
      setFilteredAccounts(response.data);
    } catch (error) {
      setError(error.message);
      toast.error("Failed to fetch accounts.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch deals for a selected account
  const fetchDeals = async (accountId) => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/api/deal?accountId=${accountId}`);
      setDeals(response.data.deals);
    } catch (error) {
      setError(error.message);
      toast.error("Failed to fetch deals.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch all deals
  const fetchAllDeals = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/api/deal`);
      setDeals(response.data.deals);
    } catch (error) {
      setError(error.message);
      toast.error("Failed to fetch deals.");
    } finally {
      setLoading(false);
    }
  };

  // Reset selected account and show all deals
  const resetSelectedAccount = () => {
    setSelectedAccount(null);
    setSearchTerm("");
    fetchAllDeals();
  };

  // Open modal to add a deal
  const openModal = (account) => {
    setSelectedAccount(account);
    setFormData({
      title: "",
      stage: "Demo Scheduled",
      currentTools: "",
      crossBrowserTesting: "",
      automationPercentage: "",
      testingTeam: "",
      challenges: "",
      ciCdChallenges: "",
      goals: "",
      technicalEnvironment: "",
      budgetAllocated: "",
      trialSuccessMetrics: "",
      collaborationProcess: "",
      price: "", // Initialize price field
    });
    setIsModalOpen(true);
  };

  // Handle search input change
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setFilteredAccounts(
      accounts.filter((acc) =>
        acc.companyName.toLowerCase().includes(value.toLowerCase())
      )
    );
    setShowDropdown(true);
  };

  // Select an account from the search results
  const handleSelectAccount = (account) => {
    setSelectedAccount(account);
    setSearchTerm(account.companyName);
    setShowDropdown(false);
    fetchDeals(account._id);
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAccount) {
      toast.error("Please select an account before adding a deal.");
      return;
    }

    try {
      const response = await axios.post(`${apiUrl}/api/deal`, {
        ...formData,
        accountId: selectedAccount._id,
      });

      if (response.data.success) {
        toast.success("Deal added successfully!");
        fetchDeals(selectedAccount._id);
        setIsModalOpen(false);
      } else {
        toast.error(response.data.message || "Failed to submit deal.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error submitting deal.");
    }
  };

  // Handle drag-and-drop
  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;

    // If dropped outside the list
    if (!destination) return;

    // If dropped in the same place
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    // Find the deal being dragged
    const deal = deals.find((deal) => deal._id === draggableId);

    // Update the deal's stage
    const updatedDeals = deals.map((deal) =>
      deal._id === draggableId ? { ...deal, stage: destination.droppableId } : deal
    );

    setDeals(updatedDeals);

    // Optionally, update the deal's stage in the backend
    axios
      .patch(`${apiUrl}/api/deal/${draggableId}`, { stage: destination.droppableId })
      .then(() => toast.success("Deal stage updated successfully!"))
      .catch(() => toast.error("Failed to update deal stage."));
  };

  useEffect(() => {
    fetchAccounts();
    fetchAllDeals(); // Fetch all deals by default
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Deals</h2>

      {/* Account Selection with Search */}
      <div className="relative w-72 mb-4">
        <input
          type="text"
          className="p-2 border rounded w-full"
          placeholder="Search Account"
          value={searchTerm}
          onChange={handleSearch}
          onFocus={() => setShowDropdown(true)}
        />
        {showDropdown && filteredAccounts.length > 0 && (
          <ul className="absolute w-full border bg-white shadow-md mt-1 rounded max-h-48 overflow-y-auto z-10">
            {filteredAccounts.map((account) => (
              <li
                key={account._id}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelectAccount(account)}
              >
                {account.companyName}
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        onClick={() => openModal(selectedAccount)}
        className="px-4 py-2 border border-black text-black bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!selectedAccount}
      >
        ➕ Add Deal
      </button>

      {/* Deals Board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="max-w-[1100px] overflow-x-auto flex gap-4 p-2 mt-4">
          {stages.map((stage) => {
            const stageDeals = deals.filter((deal) => deal.stage === stage);
            const totalPrice = stageDeals.reduce((sum, deal) => sum + (parseFloat(deal.price) || 0), 0);

            return (
              <Droppable key={stage} droppableId={stage}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="w-64 min-w-[250px] p-4 border rounded shadow-md bg-gray-50"
                    style={{ minHeight: "400px" }}
                  >
                    <h3 className="font-semibold mb-2">{stage} = {stageDeals.length}</h3>
                    <div className="space-y-2">
                      {stageDeals.length === 0 ? (
                        <p className="text-gray-500 text-sm">No deals</p>
                      ) : (
                        stageDeals.map((deal, index) => (
                          
                          <Draggable key={deal._id} draggableId={deal._id} index={index} >
                            {(provided) => (
                              <div
                                
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="p-2 border rounded bg-white shadow-sm cursor-pointer"
                                onClick={() => navigate(`/admin-dashboard/deals/${deal._id}`)}
                              >
                                {deal.title}
                                <p className="text-sm text-gray-600">Price: ${deal.price}</p>
                              </div>
                            )}
                          </Draggable>
                        ))
                      )}
                    </div>
                    {provided.placeholder}
                    <div className="mt-4 pt-2 border-t border-gray-200">
                      <p className="text-sm text-gray-600">Total Value: ${totalPrice.toFixed(2)}</p>
                    </div>
                  </div>
                )}
              </Droppable>
            );
          })}
        </div>
      </DragDropContext>

      {/* Modal for Adding Deal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Add Deal"
        style={customStyles}
      >
        <h2 className="text-lg font-semibold mb-4">Add Deal</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {Object.keys(formData).map((key) => (
            <div key={key}>
              <label className="block text-sm font-medium">
                {key.replace(/([A-Z])/g, " $1")}
              </label>
              {key === "stage" ? (
                <select
                  name={key}
                  value={formData[key]}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                >
                  {stages.map((stage) => (
                    <option key={stage} value={stage}>
                      {stage}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={key === "price" ? "number" : "text"}
                  name={key}
                  value={formData[key]}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              )}
            </div>
          ))}
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 border border-black text-black bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-black text-black bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ListDeals;