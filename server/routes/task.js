import express from 'express';
import authMiddleware from '../middleware/authMiddlware.js';
import { 
  getTasks, 
  getTask, 
  createTask, 
  updateTask, 
  getEmployeeTasks 
} from '../controllers/taskController.js';

const router = express.Router();

// Fetch all tasks (Admin access)
router.get('/', authMiddleware, getTasks);

// Fetch a single task by ID
// router.get('/:id', authMiddleware, getTask);

// // Add a new task (when a lead is assigned to an employee)
// router.post('/add', authMiddleware, createTask);

// // Update an existing task (e.g., marking it as completed or updating its details)
// router.put('/:id', authMiddleware, updateTask);

// Fetch tasks assigned to an employee (for employee's dashboard)
router.get('/mytask', authMiddleware, getEmployeeTasks);

export default router;
