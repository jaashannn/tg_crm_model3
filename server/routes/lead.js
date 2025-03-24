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
  importLeads,
  bulkLead,
  deleteLead,
  bulkDeleteLeads,
  accountLeads
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

router.delete('/bulk-delete',authMiddleware,  bulkDeleteLeads);

// Delete a lead
router.delete('/:id', authMiddleware, deleteLead);

// Add a new lead
router.post('/add', authMiddleware, createLead);

// Update an existing lead
router.put('/:id', authMiddleware, updateLead);

// Assign a lead to an employee
router.put('/assign/:id', authMiddleware, assignLead);

// Get assigned leads
router.get('/tasks/', authMiddleware, getAssignedLeads);

router.get('/bulk-assign', authMiddleware, bulkLead);

router.delete('/bulk',authMiddleware,  bulkDeleteLeads);

router.post('/account-leads', accountLeads);

export default router;
