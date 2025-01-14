// controllers/meetingController.js
import Meeting from '../models/Meeting.js';

export const createMeeting = async (req, res) => {
  const { title, lead, assignedTo, meetingDate, meetingTime, agenda, notes, createdBy } = req.body;

  // Validate required fields
  if (!title || !lead || !assignedTo || !meetingDate || !meetingTime || !agenda) {
    return res.status(400).json({ success: false, message: 'All required fields must be provided.' });
  }

  try {
    // Create a new meeting
    const newMeeting = new Meeting({
      title,
      lead,
      assignedTo,
      meetingDate,
      meetingTime,
      agenda,
      notes,
      createdBy,
    });

    // Save meeting to the database
    await newMeeting.save();

    return res.status(201).json({
      success: true,
      message: 'Meeting created successfully.',
      meeting: newMeeting,
    });
  } catch (error) {
    console.error('Error creating meeting:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while creating the meeting.',
      error: error.message, // Include error message for better debugging
    });
  }
};

export const getMeetings = async (req, res) => {
  try {
    // Fetch all meetings with populated lead and assignedTo details
    const meetings = await Meeting.find()
      .populate('lead', 'name email') // Select only necessary fields
      .populate('assignedTo', 'name email');

    return res.status(200).json({
      success: true,
      meetings,
    });
  } catch (error) {
    console.error('Error fetching meetings:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching meetings.',
      error: error.message, // Include error message for better debugging
    });
  }
};
