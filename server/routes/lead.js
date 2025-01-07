import express from 'express';
import authMiddleware from '../middleware/authMiddlware.js';
import { 
  getLeads, 
  getLead, 
  updateLead, 
  assignLead, 
  createLead, 
  getAssignedLeads, 
  exportLeads,
  importLeads
} from '../controllers/leadController.js';

const router = express.Router();

// Fetch all leads
router.get('/', authMiddleware, getLeads);

// Export leads to Excel
router.get('/export', authMiddleware, exportLeads);

// Import leads endpoint
router.post('/import', authMiddleware, importLeads);


// Fetch a single lead by ID
router.get('/:id', authMiddleware, getLead);

// Add a new lead
router.post('/add', authMiddleware, createLead);

// Update an existing lead
router.put('/:id', authMiddleware, updateLead);

// Assign a lead to an employee
router.put('/assign/:id', authMiddleware, assignLead);

// Get assigned leads
router.get('/tasks/', authMiddleware, getAssignedLeads);

export default router;
