// controllers/meetingController.js

import Meeting from '../models/Meeting.js';
import Task from '../models/Task.js';
import Lead from '../models/Lead.js';

export const createMeeting = async (req, res) => {
  try {
    const { taskId, leadId, meetingDate, meetingTime, agenda, notes } = req.body;

    // Check if the user is admin or employee and validate accordingly
    let meetingData = {
      meetingDate,
      meetingTime,
      agenda,
      notes,
      createdBy: req.user.role, // Assuming user role is stored in the req.user object
    };

    // If the logged-in user is an admin, associate with a lead
    // console.log(req.user,'req.user ')
    // console.log(req.user.role,'req.user roel')

    if (req.user.role === 'admin') {
      if (!leadId) {
        return res.status(400).json({ success: false, message: 'Lead is required for admin' });
      }
      meetingData.leadId = leadId;
    }

    // If the logged-in user is an employee, associate with a task
    if (req.user.role === 'employee') {
      if (!taskId) {
        return res.status(400).json({ success: false, message: 'Task is required for employee' });
      }
      meetingData.taskId = taskId;
      meetingData.employeeId = req.user.id; // Assuming employeeId is stored in req.user
      // console.log(req.user.id,"its employee id")
      // console.log(taskId,"taskid ")
    }


    const meeting = new Meeting(meetingData);

    await meeting.save();

    res.status(200).json({
      success: true,
      message: 'Meeting created successfully',
      meeting,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error, please try again later',
    });
  }
};

export const getMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find()
      .populate('taskId')
      .populate('leadId')
      .populate('employeeId');

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
