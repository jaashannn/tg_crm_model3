// controllers/meetingController.js
import Meeting from '../models/Meeting.js';

export const createMeeting = async (req, res) => {
  // console.log(req.body)
  const { title, lead, assignedTo, meetingDate, meetingTime, agenda, notes, createdBy } = req.body;

  if (!title || !lead || !assignedTo || !meetingDate || !meetingTime || !agenda) {
    return res.status(400).json({ success: false, message: 'All required fields must be provided.' });
  }

  try {
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

    await newMeeting.save();

    return res.status(201).json({ success: true, message: 'Meeting created successfully.', meeting: newMeeting });
  } catch (error) {
    console.error('Error creating meeting:', error);
    return res.status(500).json({ success: false, message: 'Server error while creating the meeting.' });
  }
};


export const getMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find()
      .populate('lead')
      .populate('assignedTo');

    res.status(200).json({
      success: true,
      meetings,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error, please try again later',
    });
  }
};
