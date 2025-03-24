// controllers/meetingController.js
import Meeting from '../models/Meeting.js';

export const createMeeting = async (req, res) => {
  let { title, lead, assignedTo, meetingDate, meetingTime, agenda, notes, createdBy } = req.body;
  // console.log(req.body)

  // Ensure assignedTo is an array
  if (!Array.isArray(assignedTo)) {
    assignedTo = [assignedTo]; // Convert single value to array if necessary
  }

  // Validate required fields
  if (!title || !lead || !assignedTo.length || !meetingDate || !meetingTime) {
    return res.status(400).json({ success: false, message: 'All required fields must be provided.' });
  }

  try {
    // Create a new meeting
    const newMeeting = new Meeting({
      title,
      lead,
      assignedTo, // Now stored as an array
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
      error: error.message,
    });
  }
};


export const deleteMeeting = async (req, res) => {
  try {
    const { id } = req.params;
    // console.log(`Request to delete meeting with id: ${req.params}`);

    // Check if the meeting exists
    const meeting = await Meeting.findById(id);
    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: 'Meeting not found.',
      });
    }

    // Delete the meeting
    await Meeting.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: 'Meeting deleted successfully.',
    });
  } catch (error) {
    console.error('Error deleting meeting:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while deleting meeting.',
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
      // console.log(`Meetings found: ${meetings}`);

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

// Update the status of a meeting
export const updateMeetingStatus = async (req, res) => {
  const { meetingId } = req.params;
  const { status } = req.body;
  // console.log(`Request to update meetingId: ${meetingId} with status: ${status}`);
  
  try {
    let meeting = await Meeting.findById(meetingId);
    // console.log(`Meeting found: ${meeting}`);

    if (meeting) {
      // Update existing meeting
      meeting.status = status;
      await meeting.save();
      // console.log(`Meeting status updated to: ${status}`);
      return res.status(200).json({
        success: true,
        message: 'Meeting status updated successfully.',
      });
    } else {
      return res.status(404).json({
        success: false,
        message: 'Meeting not found.',
      });
    }
  } catch (error) {
    console.error(`Error updating meeting status: ${error}`);
    res.status(500).json({
      success: false,
      message: 'Error updating status. Please try again.',
    });
  }
};