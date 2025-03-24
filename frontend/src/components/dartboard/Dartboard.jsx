import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Modal from 'react-modal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { MdColorLens } from 'react-icons/md'; // Import the color brush icon

// Modal styles
const customStyles = {
  content: {
    maxWidth: '600px',
    margin: 'auto',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
    backgroundColor: '#ffffff',
    marginTop: '100px',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    backdropFilter: 'blur(4px)',
  },
};

const Dartboard = () => {
  const apiUrl = import.meta.env.VITE_API_URL; // Fallback URL
  const [accounts, setAccounts] = useState([]); // Initialize as an empty array
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    stage: 'Hunting',
    initialDiscussionDate: null,
    requirementsFinalizationDate: null,
    pocStartDate: null,
    pocEndDate: null,
    dailyTouchpoints: null,
    pocCompletionDate: null,
    budgetApprovalDate: null,
    contractSigningDate: null,
    onboardingStartDate: null,
  });
  const [colors, setColors] = useState({}); // State to store cell colors
  const [showColorPicker, setShowColorPicker] = useState(false); // State to control color picker visibility

  // Fetch all accounts
  const fetchAccounts = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/accounts`);
      console.log('API Response:', response.data); // Log the response

      if (response.data && Array.isArray(response.data)) {
        // Filter accounts that have addToDartboard set to true
        const filteredAccounts = response.data.filter((account) => account.addToDartboard);

        setAccounts(filteredAccounts); // Set only the filtered accounts

        // Load saved colors from localStorage
        const savedColors = {};
        filteredAccounts.forEach((account) => {
          const color = localStorage.getItem(`color_${account._id}`);
          if (color) {
            savedColors[account._id] = color;
          }
        });
        setColors(savedColors);
      } else {
        console.error('Invalid response structure:', response.data);
        toast.error('Failed to fetch accounts: Invalid response structure.');
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
      toast.error('Failed to fetch accounts.');
    }
  };

  // Open modal and fetch dartboard data for the selected account
  const openModal = async (account) => {
    setSelectedAccount(account);
    try {
      const response = await axios.get(`${apiUrl}/api/dartboard/${account._id}`);
      console.log('API Response:', response.data); // Log the response data

      // Check if the response has the expected structure
      if (response.data.success && response.data.dartboard) {
        // Pre-fill the form with the fetched dartboard data
        setFormData({
          amount: response.data.dartboard.amount || '',
          stage: response.data.dartboard.stage || 'Hunting',
          initialDiscussionDate: response.data.dartboard.initialDiscussionDate ? new Date(response.data.dartboard.initialDiscussionDate) : null,
          requirementsFinalizationDate: response.data.dartboard.requirementsFinalizationDate ? new Date(response.data.dartboard.requirementsFinalizationDate) : null,
          pocStartDate: response.data.dartboard.pocStartDate ? new Date(response.data.dartboard.pocStartDate) : null,
          pocEndDate: response.data.dartboard.pocEndDate ? new Date(response.data.dartboard.pocEndDate) : null,
          dailyTouchpoints: response.data.dartboard.dailyTouchpoints ? new Date(response.data.dartboard.dailyTouchpoints) : null,
          pocCompletionDate: response.data.dartboard.pocCompletionDate ? new Date(response.data.dartboard.pocCompletionDate) : null,
          budgetApprovalDate: response.data.dartboard.budgetApprovalDate ? new Date(response.data.dartboard.budgetApprovalDate) : null,
          contractSigningDate: response.data.dartboard.contractSigningDate ? new Date(response.data.dartboard.contractSigningDate) : null,
          onboardingStartDate: response.data.dartboard.onboardingStartDate ? new Date(response.data.dartboard.onboardingStartDate) : null,
        });
      } else {
        // Initialize form data if no dartboard data exists
        setFormData({
          amount: '',
          stage: 'Hunting',
          initialDiscussionDate: null,
          requirementsFinalizationDate: null,
          pocStartDate: null,
          pocEndDate: null,
          dailyTouchpoints: null,
          pocCompletionDate: null,
          budgetApprovalDate: null,
          contractSigningDate: null,
          onboardingStartDate: null,
        });
      }
    } catch (error) {
      console.error('Error fetching dartboard data:', error);
      toast.error('Failed to fetch dartboard data.');
    }
    setIsModalOpen(true);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle date changes
  const handleDateChange = (date, name) => {
    setFormData({ ...formData, [name]: date });
  };

  // Submit updated dartboard data
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${apiUrl}/api/dartboard/${selectedAccount._id}`, formData);
      if (response.data) {
        toast.success('Dartboard data updated successfully!');
        setIsModalOpen(false);
      } else {
        toast.error('Failed to update data.');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating data.');
    }
  };

  // Handle color change for a cell
  const handleColorChange = (color) => {
    if (selectedAccount) {
      const newColors = { ...colors, [selectedAccount._id]: color };
      setColors(newColors);
      localStorage.setItem(`color_${selectedAccount._id}`, color); // Save color to localStorage
      setShowColorPicker(false); // Hide the color picker after selection
    }
  };

  // Fetch accounts on component mount
  useEffect(() => {
    fetchAccounts();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Dartboard Accounts</h2>
      {accounts.length === 0 ? (
        <p>No accounts available.</p>
      ) : (
        <div className="overflow-hidden">
          <table className="border border-gray-300 w-full border-collapse">
            <tbody>
              {Array.from({ length: Math.ceil(accounts.length / 6) }).map((_, rowIndex) => (
                <tr key={rowIndex} className="whitespace-nowrap">
                  {accounts.slice(rowIndex * 6, rowIndex * 6 + 6).map((account) => (
                    <td
                      key={account._id}
                      className="border border-gray-300 p-3 text-center text-black font-medium cursor-pointer hover:brightness-110 transition"
                      style={{ backgroundColor: colors[account._id] || '#ffffff' }}
                      onClick={() => openModal(account)}
                    >
                      {account.companyName}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Dartboard Data"
        style={customStyles}
      >
        <h2 style={{ fontSize: '22px', fontWeight: '600', color: '#333', marginBottom: '20px' }}>
          Edit Dartboard Data for {selectedAccount?.companyName}
        </h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Amount */}
          {/* Color Picker */}
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#333' }}>
              Change Cell Color:
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <MdColorLens
                className="cursor-pointer text-2xl"
                onClick={() => setShowColorPicker(!showColorPicker)}
              />
              {showColorPicker && (
                <input
                  type="color"
                  value={colors[selectedAccount?._id] || '#ffffff'}
                  onChange={(e) => handleColorChange(e.target.value)}
                  style={{ cursor: 'pointer' }}
                />
              )}
            </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#333' }}>
              Amount (USD):
            </label>
            <input
              type="text"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px' }}
            />
          </div>

          {/* Stage */}
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#333' }}>
              Stage:
            </label>
            <select
              name="stage"
              value={formData.stage}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px' }}
            >
              <option value="Hunting">Hunting</option>
              <option value="Demo Scheduled">Demo Scheduled</option>
              <option value="Demo Completed">Demo Completed</option>
              <option value="Demo Cancelled">Demo Cancelled</option>
              <option value="POC Started">POC Started</option>
              <option value="POC In Progress">POC In Progress</option>
              <option value="POC Completed">POC Completed</option>
              <option value="Security Review">Security Review</option>
              <option value="Procurement">Procurement</option>
              <option value="Closed Won">Closed Won</option>
            </select>
          </div>

          {/* Date Fields */}
          {[
            'initialDiscussionDate',
            'requirementsFinalizationDate',
            'pocStartDate',
            'pocEndDate',
            'dailyTouchpoints',
            'pocCompletionDate',
            'budgetApprovalDate',
            'contractSigningDate',
            'onboardingStartDate',
          ].map((field) => (
            <div key={field}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#333' }}>
                {field.replace(/([A-Z])/g, ' $1').trim()}:
              </label>
              <DatePicker
                selected={formData[field]}
                onChange={(date) => handleDateChange(date, field)}
                dateFormat="yyyy-MM-dd"
                placeholderText={`Select ${field.replace(/([A-Z])/g, ' $1').trim()}`}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px' }}
              />
            </div>
          ))}



          {/* Submit and Cancel Buttons */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button
              type="submit"
              className="px-4 py-2 border border-black text-black bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
            >
              Save Changes
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

export default Dartboard;