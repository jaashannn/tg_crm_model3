import express from 'express';
import {
  getAccounts,
  getDartboardData,
  updateDartboardData,
} from '../controllers/dartboardController.js';

const router = express.Router();

// Get all accounts
// router.get('/accounts', getAccounts);

// Get dartboard data for a specific account
router.get('/:accountId', getDartboardData);

// Update dartboard data for a specific account
router.put('/:accountId', updateDartboardData);

export default router;