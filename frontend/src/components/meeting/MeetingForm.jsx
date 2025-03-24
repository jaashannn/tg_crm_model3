import React, { useState } from "react";
import Modal from "react-modal";
import axios from "axios";
import { toast } from "react-hot-toast";

const DemoFeedbackForm = ({ closeForm, meetingId }) => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [formData, setFormData] = useState({
    prospectName: "",
    titleLevel: "",
    linkedin: "",
    role: "",
    email: "",
    phone: "",
    website: "",
    budget: "allocated",
    authority: "",
    need: "yes",
    pocCriteria: "met",
    opportunity: "3 month",
    meetingId: meetingId, // Include the meetingId in the form data
  });

  const [isModalOpen, setIsModalOpen] = useState(true);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}/api/demo`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.success) {
        toast.success("Demo feedback submitted successfully!");
        setIsModalOpen(false); // ✅ Close modal on success
        closeForm(); // ✅ Notify parent component to close
      } else {
        toast.error(response.data.error || "Failed to submit feedback.");
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Error submitting feedback.");
    }
  };

  return (
    <Modal
      isOpen={isModalOpen}
      contentLabel="Demo Feedback Form"
      shouldCloseOnOverlayClick={false} // Prevent closing on background click
      shouldCloseOnEsc={false} // Prevent closing on pressing Escape
      style={{
        content: {
          maxWidth: "500px",
          margin: "auto",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
          marginTop: "50px",
        },
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        },
      }}
    >
      <h2>Demo Feedback Form</h2>
      <form onSubmit={handleSubmit}>
        {Object.keys(formData).map((field) => (
          <div key={field} style={{ marginBottom: "10px" }}>
            <label htmlFor={field} style={{ display: "block", fontWeight: "bold" }}>
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
            {["budget", "need", "pocCriteria", "opportunity"].includes(field) ? (
              <select
                id={field}
                name={field}
                value={formData[field]}
                onChange={handleInputChange}
                style={{ width: "100%", padding: "8px" }}
              >
                {field === "budget" && (
                  <>
                    <option value="allocated">Allocated</option>
                    <option value="not allocated">Not Allocated</option>
                    <option value="need approval">Need Approval</option>
                  </>
                )}
                {field === "need" && (
                  <>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </>
                )}
                {field === "pocCriteria" && (
                  <>
                    <option value="met">Met</option>
                    <option value="not met">Not Met</option>
                    <option value="tbd">TBD</option>
                  </>
                )}
                {field === "opportunity" && (
                  <>
                    <option value="3 month">3 Month</option>
                    <option value="6 month">6 Month</option>
                    <option value="no">No</option>
                  </>
                )}
              </select>
            ) : (
              <input
                type="text"
                id={field}
                name={field}
                value={formData[field]}
                onChange={handleInputChange}
                style={{ width: "100%", padding: "8px" }}
                disabled={field === "meetingId"} // Disable the meetingId field as it's auto-populated
              />
            )}
          </div>
        ))}
        <button
          type="submit"
          className="px-4 py-2 border border-black text-black bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
        >
          Submit
        </button>


      </form>
    </Modal>
  );
};

export default DemoFeedbackForm;
