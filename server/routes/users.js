const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
const isAdmin = require('../middleware/isAdmin');

// Get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get all users (admin only)
router.get('/all', isAdmin, async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: error.message });
    }
});

// Register new user
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email and password are required' });
        }

        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email: email.toLowerCase(),
            password: hashedPassword
        });

        await user.save();
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            balance: user.balance
        });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// Login user
router.post('/login', async (req, res) => {
    try {
        console.log('Login attempt:', req.body);
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: 'Email and password are required'
            });
        }

        // Find user by email
        const user = await User.findOne({ email: email.toLowerCase() });
        
        if (!user) {
            return res.status(401).json({
                error: 'Invalid email or password'
            });
        }

        // Use bcrypt to compare the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                error: 'Invalid email or password'
            });
        }

        // Return user without password
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            balance: user.balance,
            isAdmin: user.isAdmin
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            error: 'Login failed',
            details: error.message
        });
    }
});

// Handle transactions (deposit/withdraw)
router.post('/:userId/transaction', async (req, res) => {
    try {
        const { userId } = req.params;
        const { type, amount } = req.body;

        console.log('Transaction request received:', { userId, type, amount });

        // Validate transaction type
        if (!type || !['deposit', 'withdraw'].includes(type.toLowerCase())) {
            return res.status(400).json({
                error: 'Invalid transaction type',
                message: "Transaction type must be 'deposit' or 'withdraw'",
                received: type
            });
        }

        // Validate amount
        const numericAmount = parseFloat(amount);
        if (isNaN(numericAmount) || numericAmount <= 0) {
            return res.status(400).json({
                error: 'Invalid amount',
                message: 'Amount must be a positive number',
                received: amount
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                error: 'User not found',
                message: 'Could not find user with provided ID',
                userId
            });
        }

        // Handle transaction
        const normalizedType = type.toLowerCase();
        let newBalance = user.balance;

        if (normalizedType === 'deposit') {
            newBalance = Number((user.balance + numericAmount).toFixed(2));
        } else if (normalizedType === 'withdraw') {
            if (user.balance < numericAmount) {
                return res.status(400).json({
                    error: 'Insufficient funds',
                    message: 'Not enough balance for withdrawal',
                    balance: user.balance,
                    requested: numericAmount
                });
            }
            newBalance = Number((user.balance - numericAmount).toFixed(2));
        }

        // Format date consistently
        const formatter = new Intl.DateTimeFormat('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
            timeZone: 'America/New_York'
        });

        const transactionDate = new Date();
        user.transactions.push({
            type: normalizedType,
            amount: numericAmount,
            balance: newBalance,
            date: transactionDate
        });

        // Update balance
        user.balance = newBalance;

        // Save and return updated user
        await user.save();
        console.log('Transaction successful:', {
            userId,
            type: normalizedType,
            amount: numericAmount,
            newBalance: user.balance,
            date: formatter.format(transactionDate)
        });

        // Sort transactions by date in descending order (newest first)
        const sortedTransactions = user.transactions.sort((a, b) => b.date - a.date);

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            balance: user.balance,
            transactions: sortedTransactions
        });

    } catch (error) {
        console.error('Transaction error:', {
            message: error.message,
            stack: error.stack
        });
        res.status(500).json({
            error: 'Transaction failed',
            message: error.message
        });
    }
});

// Get transactions for a specific user
router.get('/:userId/transactions', async (req, res) => {
    try {
        const { userId } = req.params;

        // Validate userId format
        if (!ObjectId.isValid(userId)) {
            return res.status(400).json({ 
                error: 'Invalid user ID format',
                userId 
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                error: 'User not found',
                message: 'Could not find user with provided ID',
                userId
            });
        }

        // Sort transactions by date in descending order (newest first)
        const sortedTransactions = user.transactions.sort((a, b) => b.date - a.date);

        res.json(sortedTransactions);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({
            error: 'Failed to fetch transactions',
            message: error.message
        });
    }
});

// Change user password
router.patch('/:userId/password', async (req, res) => {
    try {
        const { userId } = req.params;
        const { newPassword } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ error: 'Failed to change password' });
    }
});

// Delete user with admin password verification
router.delete('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const adminPassword = req.headers['admin-password'];

        // Validate userId format
        if (!ObjectId.isValid(userId)) {
            return res.status(400).json({ 
                error: 'Invalid user ID format',
                userId 
            });
        }

        // Validate admin password presence
        if (!adminPassword) {
            return res.status(400).json({ 
                error: 'Admin password is required in headers'
            });
        }

        const adminUser = await User.findById(req.userId);
        if (!adminUser || !adminUser.isAdmin) {
            console.error('Admin access required:', {
                userId: req.userId,
                adminUser
            });
            return res.status(403).json({ 
                error: 'Admin access required',
                details: 'User not found or not authorized as admin'
            });
        }

        // Verify admin password
        const isPasswordValid = await bcrypt.compare(adminPassword, adminUser.password);
        if (!isPasswordValid) {
            console.error('Invalid admin password:', {
                userId: req.userId,
                adminPassword
            });
            return res.status(403).json({ 
                error: 'Invalid admin password'
            });
        }

        // Find user to be deleted
        const userToDelete = await User.findById(userId);
        if (!userToDelete) {
            return res.status(404).json({ 
                error: 'User not found',
                userId 
            });
        }

        // Delete the user
        await User.deleteOne({ _id: userId });

        // Log successful deletion
        console.log('User deleted successfully:', {
            deletedUserId: userId,
            adminId: req.userId,
            timestamp: new Date().toISOString(),
            userEmail: userToDelete.email
        });

        res.json({ 
            message: 'User deleted successfully',
            deletedUserId: userId
        });

    } catch (error) {
        console.error('Error deleting user:', {
            error: error.message,
            stack: error.stack,
            userId: req.params.userId
        });

        res.status(500).json({ 
            error: 'Failed to delete user',
            details: error.message
        });
    }
});
  
module.exports = router;