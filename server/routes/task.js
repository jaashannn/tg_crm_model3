import express from 'express';
import authMiddleware from '../middleware/authMiddlware.js';
import { 
  assignTask,
  getTasks, 
  getTask, 
  createTask, 
  updateTaskStatus, 
  getEmployeeTasks,
  bulkTask
} from '../controllers/taskController.js';


const router = express.Router();

// Fetch all tasks (Admin access)
router.get('/', authMiddleware, getTasks);

// Fetch a single task by ID
router.get('/mytask/:id', authMiddleware, getTask);

// Add a new task (when a lead is assigned to an employee)
router.post('/add-task', authMiddleware, createTask);


// Add a new task (when a lead is assigned to an employee)
router.post('/add-task/:id', authMiddleware, assignTask);

// Update an existing task (e.g., marking it as completed or updating its details)
router.put('/update-status/:id', updateTaskStatus);


router.post('/bulk-assign', authMiddleware, bulkTask);

// Fetch tasks assigned to an employee (for employee's dashboard)
router.get('/mytask', authMiddleware, getEmployeeTasks);

export default router;
