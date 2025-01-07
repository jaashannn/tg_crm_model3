// // MeetingForm.jsx
// import React, { useState } from 'react';

// const MeetingForm = () => {
//   const [title, setTitle] = useState('');
//   const [date, setDate] = useState('');
//   const [time, setTime] = useState('');
//   const [description, setDescription] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const meetingData = {
//       title,
//       date,
//       time,
//       description,
//     };

//     try {
//       const response = await fetch('http://localhost:5000/api/meeting', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('token')}`,  // Ensure authentication token is available
//         },
//         body: JSON.stringify(meetingData),
//       });

//       if (response.ok) {
//         alert('Meeting created successfully!');
//         // Clear the form fields
//         setTitle('');
//         setDate('');
//         setTime('');
//         setDescription('');
//       } else {
//         const error = await response.json();
//         alert(`Error: ${error.message}`);
//       }
//     } catch (error) {
//       alert('Failed to create meeting. Please try again later.');
//       console.error('Error creating meeting:', error);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="meeting-form">
//       <div>
//         <label>Title:</label>
//         <input
//           type="text"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           required
//         />
//       </div>

//       <div>
//         <label>Date:</label>
//         <input
//           type="date"
//           value={date}
//           onChange={(e) => setDate(e.target.value)}
//           required
//         />
//       </div>

//       <div>
//         <label>Time:</label>
//         <input
//           type="time"
//           value={time}
//           onChange={(e) => setTime(e.target.value)}
//           required
//         />
//       </div>

//       <div>
//         <label>Description:</label>
//         <textarea
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//           required
//         />
//       </div>

//       <button type="submit">Create Meeting</button>
//     </form>
//   );
// };

// export default MeetingForm;
