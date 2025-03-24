import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

const DemoFeedbackForm = ({ closeForm, meetingId }) => {
  const [feedback, setFeedback] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Submit feedback to the server (you can use axios here)
      console.log('Feedback submitted for meeting:', meetingId, feedback);
      toast.success('Feedback submitted successfully!');
      closeForm();
    } catch (error) {
      toast.error('Failed to submit feedback.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-lg font-semibold mb-4">Feedback Form</h2>
        <form onSubmit={handleSubmit}>
          <textarea
            placeholder="Enter your feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="w-full border border-gray-300 rounded p-2 mb-4"
            required
          />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={closeForm}
              className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
            >
              Close
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Submit Feedback
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DemoFeedbackForm;