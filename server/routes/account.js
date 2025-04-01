import express from 'express';
import {
    addAccount,
    getAccounts,
    getAccountById,
    updateAccount,
    bulkAddToTarget,
    bulkAddToDartboard,
    deleteAccount,
} from '../controllers/accountController.js';

const router = express.Router();

// Route to add a new account
router.post('/', addAccount);

// Route to get all accounts
router.get('/', getAccounts);

// Route to get a specific account by ID
router.get('/:id', getAccountById);

// Route to update an account by ID
router.put('/:id', updateAccount);
router.put('/bulk/target', bulkAddToTarget);
router.put('/bulk/dartboard', bulkAddToDartboard);

// Route to delete an account by ID
router.delete('/:id', deleteAccount);

export default router;
