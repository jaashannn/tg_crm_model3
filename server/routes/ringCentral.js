// routes/ringcentralRoutes.js
import express from 'express';
import {makeCall} from '../controllers/ringCentralController.js'

const router = express.Router();

// Route to make a call
router.post('/make-call', makeCall);

export default router;
