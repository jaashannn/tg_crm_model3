import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import Loader from "../Loading/Loader"; // Assuming you have a Loader component

const Demo = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [completedMeetings, setCompletedMeetings] = useState([]);
  const [otherMeetings, setOtherMeetings] = useState([]);
  const [filteredCompletedMeetings, setFilteredCompletedMeetings] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState(""); // State for date filter
  const [loading, setLoading] = useState(true);

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/api/meeting`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (response.data.success) {
        const completed = response.data.meetings.filter(
          (meeting) => meeting.status === "completed"
        );
        const other = response.data.meetings.filter(
          (meeting) => meeting.status !== "completed"
        );

        const meetingsWithFeedback = await Promise.all(
          completed.map(async (meeting) => {
            const feedbackResponse = await axios.get(
              `${apiUrl}/api/demo/${meeting._id}/feedback`,
              {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
              }
            );
            return {
              ...meeting,
              feedback: feedbackResponse.data.success ? feedbackResponse.data.feedback : null,
            };
          })
        );

        setCompletedMeetings(meetingsWithFeedback);
        setFilteredCompletedMeetings(meetingsWithFeedback);
        setOtherMeetings(other);
      }
    } catch (error) {
      toast.error("No meetings available. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  // Handle search and date filtering for completed meetings
  useEffect(() => {
    const filtered = completedMeetings.filter((meeting) => {
      const companyName = meeting.lead?.name?.toLowerCase() || "";
      const employeeName = meeting.feedback?.prospectName?.toLowerCase() || "";
      const title = meeting.title.toLowerCase();
      const formattedDate = new Date(meeting.meetingDate).toISOString().split("T")[0]; // Convert to YYYY-MM-DD

      const matchesSearch =
        companyName.includes(searchQuery.toLowerCase()) ||
        employeeName.includes(searchQuery.toLowerCase()) ||
        title.includes(searchQuery.toLowerCase());

      const matchesDate = selectedDate ? formattedDate === selectedDate : true;

      return matchesSearch && matchesDate;
    });

    setFilteredCompletedMeetings(filtered);
  }, [searchQuery, selectedDate, completedMeetings]);

  if (loading) return <Loader />;

  return (
    <div className="container mx-auto p-6 h-screen flex flex-col gap-6">
      {/* Filters Section */}
      <div className="flex gap-4">
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search by company, employee, or title..."
        className="px-4 py-2 border border-black text-black bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

<input
  type="date"
  className="px-4 py-2 border border-black text-black bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:bg-gray-50 cursor-pointer appearance-none custom-date-input"
  value={selectedDate}
  onChange={(e) => setSelectedDate(e.target.value)}
/>


      </div>

      {/* Two Scrollable Sections */}
      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Completed Meetings Section */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          <h2 className="text-2xl font-semibold mb-4">Completed Meetings</h2>
          {filteredCompletedMeetings.length === 0 ? (
            <p className="text-gray-600">No completed meetings available.</p>
          ) : (
            <div className="space-y-4">
              {filteredCompletedMeetings.map((meeting) => (
                <CompletedMeetingCard key={meeting._id} meeting={meeting} />
              ))}
            </div>
          )}
        </div>

        {/* Other Meetings Section */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          <h2 className="text-2xl font-semibold mb-4">Other Meetings</h2>
          {otherMeetings.length === 0 ? (
            <p className="text-gray-600">No other meetings available.</p>
          ) : (
            <div className="space-y-4">
              {otherMeetings.map((meeting) => (
                <OtherMeetingCard key={meeting._id} meeting={meeting} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Component for Completed Meeting Card
const CompletedMeetingCard = ({ meeting }) => {
  const [showFeedback, setShowFeedback] = useState(false);

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-blue-600 mb-2">{meeting.title}</h3>
      <p><strong>Lead:</strong> {meeting.lead ? meeting.lead.name : "N/A"}</p>
      <p><strong>Date:</strong> {new Date(meeting.meetingDate).toLocaleDateString()}</p>
      <p><strong>Time:</strong> {meeting.meetingTime}</p>
      <p><strong>Agenda:</strong> {meeting.agenda || "N/A"}</p>
      <p><strong>Notes:</strong> {meeting.notes || "N/A"}</p>

      {meeting.feedback ? (
        <div className="mt-4">
          <button
            onClick={() => setShowFeedback(!showFeedback)}
            className="text-blue-600 hover:underline"
          >
            {showFeedback ? "Hide Feedback" : "Feedback"}
          </button>
          {showFeedback && (
            <div className="mt-4 p-4 border-t border-gray-300">
              <h4 className="text-md font-semibold">Feedback</h4>
              <p><strong>Prospect Name:</strong> {meeting.feedback.prospectName}</p>
              <p><strong>Title Level:</strong> {meeting.feedback.titleLevel}</p>
              <p><strong>LinkedIn:</strong> {meeting.feedback.linkedin}</p>
              <p><strong>Role:</strong> {meeting.feedback.role}</p>
              <p><strong>Email:</strong> {meeting.feedback.email}</p>
              <p><strong>Phone:</strong> {meeting.feedback.phone}</p>
              <p><strong>Website:</strong> {meeting.feedback.website}</p>
              <p><strong>Budget:</strong> {meeting.feedback.budget}</p>
              <p><strong>Authority:</strong> {meeting.feedback.authority}</p>
              <p><strong>Need:</strong> {meeting.feedback.need}</p>
              <p><strong>POC Criteria:</strong> {meeting.feedback.pocCriteria}</p>
              <p><strong>Opportunity:</strong> {meeting.feedback.opportunity}</p>
            </div>
          )}
        </div>
      ) : (
        <p className="mt-4 text-gray-500">No feedback available for this meeting.</p>
      )}
    </div>
  );
};

// Component for Other Meeting Card
const OtherMeetingCard = ({ meeting }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-blue-600 mb-2">{meeting.title}</h3>
      <p><strong>Lead:</strong> {meeting.lead ? meeting.lead.name : "N/A"}</p>
      <p><strong>Date:</strong> {new Date(meeting.meetingDate).toLocaleDateString()}</p>
      <p><strong>Time:</strong> {meeting.meetingTime}</p>
      <p><strong>Agenda:</strong> {meeting.agenda || "N/A"}</p>
      <p><strong>Notes:</strong> {meeting.notes || "N/A"}</p>
      <p><strong>Status:</strong> {meeting.status}</p>
    </div>
  );
};

export default Demo;
