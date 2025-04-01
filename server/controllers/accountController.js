import Account from '../models/Account.js';
import mongoose from 'mongoose';

// Add new account
export const addAccount = async (req, res) => {
    try {
        const accountData = req.body;
        const newAccount = await Account.create(accountData);
        res.status(201).json(newAccount);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all accounts
export const getAccounts = async (req, res) => {
    try {
        const accounts = await Account.find();
        res.status(200).json(accounts );
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get account by ID
export const getAccountById = async (req, res) => {
    try {
        const { id } = req.params;
        // console.log(id);
        const account = await Account.findById(id);
        // console.log(account);
        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }
        res.status(200).json(account);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update account
export const updateAccount = async (req, res) => {
    try {
        const updatedAccount = await Account.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedAccount) {
            return res.status(404).json({ message: 'Account not found' });
        }
        res.status(200).json(updatedAccount);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const bulkUpdateAccounts = async (accountIds, fieldToUpdate) => {
    if (!accountIds || !Array.isArray(accountIds)) {
        throw new Error('Account IDs array is required');
    }

    // Validate ObjectIds
    const invalidIds = accountIds.filter(id => !mongoose.Types.ObjectId.isValid(id));
    if (invalidIds.length > 0) {
        throw new Error(`Invalid account IDs: ${invalidIds.join(', ')}`);
    }

    let result;
    if (accountIds.length === 1) {
        // Use updateOne for single updates
        result = await Account.updateOne(
            { _id: accountIds[0] },
            { [fieldToUpdate]: true }
        );
    } else {
        // Use updateMany for bulk updates
        result = await Account.updateMany(
            { _id: { $in: accountIds } },
            { [fieldToUpdate]: true }
        );
    }

    if (result.nModified === 0) {
        throw new Error('No matching accounts found or no changes made');
    }

    return result;
};

// Bulk add to target
export const bulkAddToTarget = async (req, res) => {
    try {
        const { accountIds } = req.body;
        // console.log('Adding to target:', accountIds);

        const result = await bulkUpdateAccounts(accountIds, 'isTargetAccount');

        res.status(200).json({
            message: `Successfully added accounts to target accounts`,
            updatedCount: result.nModified
        });
    } catch (error) {
        console.error('Error in bulkAddToTarget:', error);
        res.status(400).json({ 
            message: error.message,
            details: error.stack // Optional: for debugging in dev
        });
    }
};

// Bulk add to dartboard
export const bulkAddToDartboard = async (req, res) => {
    try {
        const { accountIds } = req.body;
        // console.log('Adding to dartboard:', accountIds);

        const result = await bulkUpdateAccounts(accountIds, 'addToDartboard');
        // console.log('Bulk update result:', result);

        res.status(200).json({
            message: `Successfully added accounts to dartboard`,
            updatedCount: result.nModified
        });
    } catch (error) {
        console.error('Error in bulkAddToDartboard:', error);
        res.status(400).json({ 
            message: error.message,
            details: error.stack // Optional: for debugging in dev
        });
    }
};

// Delete account
export const deleteAccount = async (req, res) => {
    try {
        const deletedAccount = await Account.findByIdAndDelete(req.params.id);
        if (!deletedAccount) {
            return res.status(404).json({ message: 'Account not found' });
        }
        res.status(200).json({ message: 'Account deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
