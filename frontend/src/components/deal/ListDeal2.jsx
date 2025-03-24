import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Modal from 'react-modal';
import { FaPlus, FaEye, FaTimes, FaCheck, FaTools, FaCogs, FaMoneyBill, FaChartLine, FaUsers, FaEdit } from 'react-icons/fa';
import Loader from '../Loading/Loader';
// Modal styles
const customStyles = {
  content: {
    maxWidth: '600px',
    margin: 'auto',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
    backgroundColor: '#ffffff',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    backdropFilter: 'blur(4px)',
  },
};

const Deal = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [deals, setDeals] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);


  const [formData, setFormData] = useState({
    currentTools: '',
    crossBrowserTesting: '',
    automationPercentage: '',
    testingTeam: '',
    challenges: '',
    ciCdChallenges: '',
    goals: '',
    technicalEnvironment: '',
    budgetAllocated: '',
    trialSuccessMetrics: '',
    collaborationProcess: '',
  });
  const [editFormData, setEditFormData] = useState({
    _id: '',
    currentTools: '',
    crossBrowserTesting: '',
    automationPercentage: '',
    testingTeam: '',
    challenges: '',
    ciCdChallenges: '',
    goals: '',
    technicalEnvironment: '',
    budgetAllocated: '',
    trialSuccessMetrics: '',
    collaborationProcess: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all accounts
  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/api/accounts`);
      setAccounts(response.data);
    } catch (error) {
      setError(error.message);
      toast.error('Failed to fetch accounts.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch deals for a specific account
  const fetchDeals = async (accountId) => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/api/deal?accountId=${accountId}`);
      setDeals(response.data.deals);
    } catch (error) {
      setError(error.message);
      toast.error('Failed to fetch deals.');
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes for add deal form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle input changes for edit deal form
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  // Handle form submission (add deal)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}/api/deal`, {
        ...formData,
        accountId: selectedAccount._id,
      });
      if (response.data.success) {
        toast.success('Deal added successfully!');
        fetchDeals(selectedAccount._id);
        setIsModalOpen(false);
      } else {
        toast.error(response.data.error || 'Failed to submit deal.');
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error submitting deal.');
    }
  };

  // Handle form submission (edit deal)
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch(`${apiUrl}/api/deal/${editFormData._id}`, {
        ...editFormData,
        accountId: selectedAccount._id,
      });
      if (response.data.success) {
        toast.success('Deal updated successfully!');
        fetchDeals(selectedAccount._id);
        setIsEditModalOpen(false);
      } else {
        toast.error(response.data.error || 'Failed to update deal.');
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error updating deal.');
    }
  };

  // Open modal for adding deal
  const openDealModal = (account) => {
    setSelectedAccount(account);
    setIsModalOpen(true);
  };

  // Open modal for editing deal
  const openEditDealModal = (deal) => {
    setEditFormData(deal);
    setIsEditModalOpen(true);
  };

  // Close modal and reset form
  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({
      currentTools: '',
      crossBrowserTesting: '',
      automationPercentage: '',
      testingTeam: '',
      challenges: '',
      ciCdChallenges: '',
      goals: '',
      technicalEnvironment: '',
      budgetAllocated: '',
      trialSuccessMetrics: '',
      collaborationProcess: '',
    });
  };

  // Close edit modal and reset form
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditFormData({
      _id: '',
      currentTools: '',
      crossBrowserTesting: '',
      automationPercentage: '',
      testingTeam: '',
      challenges: '',
      ciCdChallenges: '',
      goals: '',
      technicalEnvironment: '',
      budgetAllocated: '',
      trialSuccessMetrics: '',
      collaborationProcess: '',
    });
  };

  // Fetch accounts on component mount
  useEffect(() => {
    fetchAccounts();
  }, []);

  if (loading) return <Loader />;
  if (error) return <p>Error: {error}</p>;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: 'auto' }}>
      <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#333', marginBottom: '20px' }}>Deals</h2>
      {accounts.length === 0 ? (
        <p>No Deals available.</p>
      ) : (
        <div style={{ display: 'grid', gap: '15px' }}>
          {accounts.map((account) => (
            <div
              key={account._id}
              style={{
                padding: '15px',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#ffffff',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
              }}
            >
              <span style={{ fontSize: '16px', fontWeight: '500', color: '#333' }}>{account.companyName}</span>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => openDealModal(account)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#007bff',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <FaPlus /> Add Deal
                </button>
                <button
                  onClick={() => {
                    setSelectedAccount(account);
                    fetchDeals(account._id);
                  }}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#28a745',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <FaEye /> View Deals
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Add Deal Form */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Deal Form"
        style={customStyles}
        ariaHideApp={false}
      >
        <h2 style={{ fontSize: '22px', fontWeight: '600', color: '#333', marginBottom: '20px' }}>
          Add Deal for {selectedAccount?.name}
        </h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Understanding Their Current Setup */}
          <div>
            <h3 style={{ marginBottom: '15px', color: '#555', fontSize: '18px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaTools /> Understanding Their Current Setup
            </h3>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#333' }}>
                What testing tools or platforms are you currently using?
              </label>
              <input
                type="text"
                name="currentTools"
                value={formData.currentTools}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px' }}
                required
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#333' }}>
                How do you manage cross-browser and cross-device testing today?
              </label>
              <input
                type="text"
                name="crossBrowserTesting"
                value={formData.crossBrowserTesting}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px' }}
                required
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#333' }}>
                Are you currently automating your testing processes? If yes, what percentage of your testing is automated?
              </label>
              <input
                type="text"
                name="automationPercentage"
                value={formData.automationPercentage}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px' }}
                required
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#333' }}>
                Do you have an in-house testing team, or is it outsourced?
              </label>
              <input
                type="text"
                name="testingTeam"
                value={formData.testingTeam}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px' }}
                required
              />
            </div>
          </div>

          {/* Identifying Pain Points */}
          <div>
            <h3 style={{ marginBottom: '15px', color: '#555', fontSize: '18px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaCogs /> Identifying Pain Points
            </h3>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#333' }}>
                What are the biggest challenges you face in your testing process (e.g., time, cost, coverage, or quality)?
              </label>
              <input
                type="text"
                name="challenges"
                value={formData.challenges}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px' }}
                required
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#333' }}>
                Are you facing challenges with integrating your testing tools into your CI/CD pipelines?
              </label>
              <input
                type="text"
                name="ciCdChallenges"
                value={formData.ciCdChallenges}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px' }}
                required
              />
            </div>
          </div>

          {/* Defining Goals and Priorities */}
          <div>
            <h3 style={{ marginBottom: '15px', color: '#555', fontSize: '18px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaChartLine /> Defining Goals and Priorities
            </h3>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#333' }}>
                What specific outcomes are you hoping to achieve with TestGrid?
              </label>
              <input
                type="text"
                name="goals"
                value={formData.goals}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px' }}
                required
              />
            </div>
          </div>

          {/* Technical Environment */}
          <div>
            <h3 style={{ marginBottom: '15px', color: '#555', fontSize: '18px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaCogs /> Technical Environment
            </h3>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#333' }}>
                What programming languages, frameworks, or tools are you currently using in your development and testing environments?
              </label>
              <input
                type="text"
                name="technicalEnvironment"
                value={formData.technicalEnvironment}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px' }}
                required
              />
            </div>
          </div>

          {/* Evaluating Budget and Commitment */}
          <div>
            <h3 style={{ marginBottom: '15px', color: '#555', fontSize: '18px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaMoneyBill /> Evaluating Budget and Commitment
            </h3>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#333' }}>
                Have you allocated a budget for improving your testing infrastructure?
              </label>
              <input
                type="text"
                name="budgetAllocated"
                value={formData.budgetAllocated}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px' }}
                required
              />
            </div>
          </div>

          {/* Trial Success Metrics */}
          <div>
            <h3 style={{ marginBottom: '15px', color: '#555', fontSize: '18px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaChartLine /> Trial Success Metrics
            </h3>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#333' }}>
                How will you measure the success of the trial?
              </label>
              <input
                type="text"
                name="trialSuccessMetrics"
                value={formData.trialSuccessMetrics}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px' }}
                required
              />
            </div>
          </div>

          {/* Process and Collaboration */}
          <div>
            <h3 style={{ marginBottom: '15px', color: '#555', fontSize: '18px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaUsers /> Process and Collaboration
            </h3>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#333' }}>
                How does your testing team collaborate with developers, product owners, and other stakeholders?
              </label>
              <input
                type="text"
                name="collaborationProcess"
                value={formData.collaborationProcess}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px' }}
                required
              />
            </div>
          </div>

          {/* Submit and Cancel Buttons */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button
              type="submit"
              style={{
                padding: '10px 20px',
                backgroundColor: '#28a745',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <FaCheck /> Add Deal
            </button>
            <button
              type="button"
              onClick={closeModal}
              style={{
                padding: '10px 20px',
                backgroundColor: '#dc3545',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <FaTimes /> Cancel
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal for Edit Deal Form */}
      <Modal
        isOpen={isEditModalOpen}
        onRequestClose={closeEditModal}
        contentLabel="Edit Deal Form"
        style={customStyles}
        ariaHideApp={false}
      >
        <h2 style={{ fontSize: '22px', fontWeight: '600', color: '#333', marginBottom: '20px' }}>
          Edit Deal for {selectedAccount?.name}
        </h2>
        <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Understanding Their Current Setup */}
          <div>
            <h3 style={{ marginBottom: '15px', color: '#555', fontSize: '18px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaTools /> Understanding Their Current Setup
            </h3>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#333' }}>
                What testing tools or platforms are you currently using?
              </label>
              <input
                type="text"
                name="currentTools"
                value={editFormData.currentTools}
                onChange={handleEditInputChange}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px' }}
                required
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#333' }}>
                How do you manage cross-browser and cross-device testing today?
              </label>
              <input
                type="text"
                name="crossBrowserTesting"
                value={editFormData.crossBrowserTesting}
                onChange={handleEditInputChange}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px' }}
                required
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#333' }}>
                Are you currently automating your testing processes? If yes, what percentage of your testing is automated?
              </label>
              <input
                type="text"
                name="automationPercentage"
                value={editFormData.automationPercentage}
                onChange={handleEditInputChange}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px' }}
                required
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#333' }}>
                Do you have an in-house testing team, or is it outsourced?
              </label>
              <input
                type="text"
                name="testingTeam"
                value={editFormData.testingTeam}
                onChange={handleEditInputChange}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px' }}
                required
              />
            </div>
          </div>

          {/* Identifying Pain Points */}
          <div>
            <h3 style={{ marginBottom: '15px', color: '#555', fontSize: '18px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaCogs /> Identifying Pain Points
            </h3>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#333' }}>
                What are the biggest challenges you face in your testing process (e.g., time, cost, coverage, or quality)?
              </label>
              <input
                type="text"
                name="challenges"
                value={editFormData.challenges}
                onChange={handleEditInputChange}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px' }}
                required
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#333' }}>
                Are you facing challenges with integrating your testing tools into your CI/CD pipelines?
              </label>
              <input
                type="text"
                name="ciCdChallenges"
                value={editFormData.ciCdChallenges}
                onChange={handleEditInputChange}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px' }}
                required
              />
            </div>
          </div>

          {/* Defining Goals and Priorities */}
          <div>
            <h3 style={{ marginBottom: '15px', color: '#555', fontSize: '18px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaChartLine /> Defining Goals and Priorities
            </h3>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#333' }}>
                What specific outcomes are you hoping to achieve with TestGrid?
              </label>
              <input
                type="text"
                name="goals"
                value={editFormData.goals}
                onChange={handleEditInputChange}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px' }}
                required
              />
            </div>
          </div>

          {/* Technical Environment */}
          <div>
            <h3 style={{ marginBottom: '15px', color: '#555', fontSize: '18px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaCogs /> Technical Environment
            </h3>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#333' }}>
                What programming languages, frameworks, or tools are you currently using in your development and testing environments?
              </label>
              <input
                type="text"
                name="technicalEnvironment"
                value={editFormData.technicalEnvironment}
                onChange={handleEditInputChange}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px' }}
                required
              />
            </div>
          </div>

          {/* Evaluating Budget and Commitment */}
          <div>
            <h3 style={{ marginBottom: '15px', color: '#555', fontSize: '18px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaMoneyBill /> Evaluating Budget and Commitment
            </h3>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#333' }}>
                Have you allocated a budget for improving your testing infrastructure?
              </label>
              <input
                type="text"
                name="budgetAllocated"
                value={editFormData.budgetAllocated}
                onChange={handleEditInputChange}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px' }}
                required
              />
            </div>
          </div>

          {/* Trial Success Metrics */}
          <div>
            <h3 style={{ marginBottom: '15px', color: '#555', fontSize: '18px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaChartLine /> Trial Success Metrics
            </h3>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#333' }}>
                How will you measure the success of the trial?
              </label>
              <input
                type="text"
                name="trialSuccessMetrics"
                value={editFormData.trialSuccessMetrics}
                onChange={handleEditInputChange}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px' }}
                required
              />
            </div>
          </div>

          {/* Process and Collaboration */}
          <div>
            <h3 style={{ marginBottom: '15px', color: '#555', fontSize: '18px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaUsers /> Process and Collaboration
            </h3>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#333' }}>
                How does your testing team collaborate with developers, product owners, and other stakeholders?
              </label>
              <input
                type="text"
                name="collaborationProcess"
                value={editFormData.collaborationProcess}
                onChange={handleEditInputChange}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px' }}
                required
              />
            </div>
          </div>

          {/* Submit and Cancel Buttons */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button
              type="submit"
              style={{
                padding: '10px 20px',
                backgroundColor: '#28a745',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <FaCheck /> Update Deal
            </button>
            <button
              type="button"
              onClick={closeEditModal}
              style={{
                padding: '10px 20px',
                backgroundColor: '#dc3545',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <FaTimes /> Cancel
            </button>
          </div>
        </form>
      </Modal>

      {/* Display Deals for Selected Account */}
      {selectedAccount && (
        <div style={{ marginTop: '40px', padding: '20px', border: '1px solid #e0e0e0', borderRadius: '8px', backgroundColor: '#ffffff', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)' }}>
          <h2 style={{ marginBottom: '20px', color: '#333', fontSize: '22px', fontWeight: '600' }}>Deals for {selectedAccount.name}</h2>
          {deals.length === 0 ? (
            <p>No deals available for this account.</p>
          ) : (
            <div style={{ display: 'grid', gap: '15px' }}>
              {deals.map((deal) => (
                <div key={deal._id} style={{ padding: '15px', border: '1px solid #e0e0e0', borderRadius: '8px', backgroundColor: '#f9fafb' }}>
                  <h3 style={{ marginBottom: '10px', color: '#555', fontSize: '18px', fontWeight: '500' }}>Deal Details</h3>
                  <p><strong>Testing Tools/Platforms:</strong> {deal.currentTools}</p>
                  <p><strong>Cross-Browser/Device Testing:</strong> {deal.crossBrowserTesting}</p>
                  <p><strong>Automation Percentage:</strong> {deal.automationPercentage}</p>
                  <p><strong>Testing Team:</strong> {deal.testingTeam}</p>
                  <p><strong>Challenges:</strong> {deal.challenges}</p>
                  <p><strong>CI/CD Challenges:</strong> {deal.ciCdChallenges}</p>
                  <p><strong>Goals:</strong> {deal.goals}</p>
                  <p><strong>Technical Environment:</strong> {deal.technicalEnvironment}</p>
                  <p><strong>Budget Allocated:</strong> {deal.budgetAllocated}</p>
                  <p><strong>Trial Success Metrics:</strong> {deal.trialSuccessMetrics}</p>
                  <p><strong>Collaboration Process:</strong> {deal.collaborationProcess}</p>
                  <button
                    onClick={() => openEditDealModal(deal)}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#ffc107',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginTop: '10px',
                    }}
                  >
                    <FaEdit /> Edit Deal
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Deal;