import React, { useState } from "react";
import { FaPhone, FaTimes } from "react-icons/fa";
import { toast } from "react-hot-toast"; // Import react-hot-toast for notifications

const CallPopup = ({ onClose, onCallInitiate }) => {
  const [isCalling, setIsCalling] = useState(false);

  // Function to initiate the call
  const handleInitiateCall = async () => {
    setIsCalling(true); // Set the calling state to true

    try {
      await onCallInitiate(); // Trigger the call initiation passed from the parent component
      setIsCalling(false); // Reset the calling state
      toast.success("Call initiated successfully!"); // Notify the user of success
    } catch (error) {
      setIsCalling(false); // Reset the calling state on error
      toast.error("An error occurred while initiating the call.");
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-md shadow-md w-96 p-6 relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
          <FaTimes size={20} />
        </button>
        <h2 className="text-2xl font-bold text-center mb-6">Initiate Call</h2>
        <div className="flex flex-col items-center">
          <div className="text-lg font-semibold mb-4">
            Are you sure you want to make a call to the lead?
          </div>
          <button
            onClick={handleInitiateCall}
            disabled={isCalling} // Disable the button while the call is in progress
            className={`flex items-center px-6 py-3 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 transition duration-300 ${
              isCalling ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isCalling ? (
              <span>Calling...</span> // Show "Calling..." text while in progress
            ) : (
              <>
                <FaPhone className="mr-2" />
                Call Lead
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CallPopup;
