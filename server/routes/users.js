const express = require('express');
const router = express.Router();
const User = require('../models/User');

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

// Register new user
router.post('/register', async (req, res) => {
    try {
        console.log('New registration request');
        console.log('Headers:', req.headers);
        console.log('Body:', req.body);
        
        const { name, email, password } = req.body;
        
        if (!name || !email || !password) {
            console.log('Missing required fields:', { 
                name: !!name,
                email: !!email, 
                password: !!password 
            });
            return res.status(400).json({ 
                error: 'Name, email and password are required',
                received: { name: !!name, email: !!email, password: !!password }
            });
        }

        console.log('Processing registration for:', { name, email });

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Create new user with name field
        const user = new User({
            name,
            email: email.toLowerCase(),
            password
        });

        // Save user and handle any validation errors
        try {
            await user.save();
            // Return user without password
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                balance: user.balance
            });
        } catch (saveError) {
            console.error('Error saving user:', saveError);
            if (saveError.code === 11000) {
                return res.status(400).json({ error: 'Email already registered' });
            }
            throw saveError;
        }

    } catch (error) {
        console.error('Detailed registration error:', {
            message: error.message,
            stack: error.stack,
            name: error.name
        });
        res.status(500).json({ 
            error: 'Registration failed',
            details: error.message
        });
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

        // Check password (currently plain text comparison)
        if (user.password !== password) {
            return res.status(401).json({
                error: 'Invalid email or password'
            });
        }

        // Return user without password
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            balance: user.balance
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
            timeZone: 'America/New_York' // Match this with your model
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

module.exports = router; 