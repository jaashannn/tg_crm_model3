// // MeetingsList.jsx
// import React, { useEffect, useState } from 'react';
// import MeetingForm from './MeetingForm'; // Import MeetingForm component

// const MeetingsList = () => {
//   const [meetings, setMeetings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showForm, setShowForm] = useState(false);  // State to toggle form visibility

//   useEffect(() => {
//     const fetchMeetings = async () => {
//       setLoading(true);
//       try {
//         const response = await fetch('http://localhost:5000/api/meeting', {
//           method: 'GET',
//           headers: {
//             'Authorization': `Bearer ${localStorage.getItem('token')}`,  // Ensure authentication token is available
//           },
//         });

//         if (response.ok) {
//           const data = await response.json();
//           setMeetings(data.meetings);
//         } else {
//           const error = await response.json();
//           alert(`Error: ${error.message}`);
//         }
//       } catch (error) {
//         alert('Failed to fetch meetings. Please try again later.');
//         console.error('Error fetching meetings:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMeetings();
//   }, []);

//   const handleCreateMeeting = () => {
//     setShowForm(true);  // Show the meeting form
//   };

//   const handleCancel = () => {
//     setShowForm(false);  // Hide the form if the user cancels
//   };

//   if (loading) {
//     return <div>Loading meetings...</div>;
//   }

//   return (
//     <div className="container">
//       <h2 className="text-center text-xl font-bold mb-4">Meetings</h2>
//       <button 
//         onClick={handleCreateMeeting} 
//         className="bg-teal-500 text-white px-6 py-2 rounded-md hover:bg-teal-600 mb-4"
//       >
//         Create Meeting
//       </button>

//       {showForm ? (
//         <div className="meeting-form-container">
//           <MeetingForm />
//           <button 
//             onClick={handleCancel} 
//             className="bg-gray-400 text-white px-4 py-2 rounded-md mt-2"
//           >
//             Cancel
//           </button>
//         </div>
//       ) : (
//         <ul className="meetings-list">
//           {meetings.map((meeting) => (
//             <li key={meeting._id} className="meeting-item bg-white p-4 shadow-lg mb-4 rounded-md">
//               <h3 className="font-semibold">{meeting.title}</h3>
//               <p><strong>Date:</strong> {meeting.date}</p>
//               <p><strong>Time:</strong> {meeting.time}</p>
//               <p><strong>Description:</strong> {meeting.description}</p>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default MeetingsList;
