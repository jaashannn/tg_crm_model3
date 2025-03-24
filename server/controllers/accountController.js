import Account from '../models/Account.js';

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
