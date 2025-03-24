import express from 'express';
import { addDemo, getMeetingFeedback } from '../controllers/demoController.js'; // Adjust path based on your folder structure

const router = express.Router();

// Route to add a new demo entry
router.post('/', addDemo);

// Route to get demo statistics
// router.get('/stats', getDemoStats);

router.get('/:meetingId/feedback', getMeetingFeedback);

export default router;
