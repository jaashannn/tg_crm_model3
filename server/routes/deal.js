import express from 'express';
import {
  addDeal,
  getDeals,
  deleteDeal,
  getDeal,
  updateDealStage,
} from '../controllers/dealController.js';

const router = express.Router();

// Add a new deal
router.post('/', addDeal);

// Get alll deals
router.get('/', getDeals);

// Get a single deal
router.get('/:id', getDeal);

// Update an existing deal
router.patch('/:id', updateDealStage);

// Delete a deal
router.delete('/:id', deleteDeal);

export default router;