const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
const isAdmin = require('../middleware/isAdmin');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Helper function to generate a random secret
const generateSecret = () => {
    return crypto.randomBytes(64).toString('hex');
};

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

        // Generate a unique account number
        const accountNumber = Math.random().toString(36).substr(2, 9).toUpperCase();

        const user = new User({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            accountNumber // Assign the generated account number
        });

        await user.save();
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            balance: user.balance,
            accountNumber: user.accountNumber // Include account number in response
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

        // Clean up expired sessions
        await user.cleanExpiredSessions();

        // Generate new session with unique secret
        const sessionSecret = generateSecret();
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24); // 24 hour expiration

        const newSession = {
            secret: sessionSecret,
            expiresAt
        };

        user.activeSessions.push(newSession);
        await user.save();

        // Get the ID of the newly created session
        const sessionId = user.activeSessions[user.activeSessions.length - 1]._id;

        // Generate JWT token with session-specific secret
        const token = jwt.sign(
            { 
                userId: user._id,
                email: user.email,
                isAdmin: user.isAdmin,
                sessionId: sessionId
            },
            sessionSecret,
            { expiresIn: '24h' }
        );

        // Return user without password and include token
        res.json({
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                balance: user.balance,
                accountNumber: user.accountNumber,
                isAdmin: user.isAdmin,
                profilePicture: user.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0D8ABC&color=fff`,
                communicationPreferences: user.communicationPreferences
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            error: 'Login failed',
            details: error.message
        });
    }
});

// Logout endpoint
router.post('/logout', async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Remove the current session
        user.activeSessions = user.activeSessions.filter(session => 
            session._id.toString() !== req.user.sessionId
        );
        await user.save();

        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ error: 'Logout failed' });
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

// Update user profile
router.patch('/:userId/profile', async (req, res) => {
    try {
        const { userId } = req.params;
        const profileData = req.body;

        // Validate userId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }

        // Find and update user
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                $set: {
                    phoneNumber: profileData.phoneNumber,
                    email: profileData.email,
                    address: profileData.address,
                    preferredName: profileData.preferredName,
                    language: profileData.language,
                    communicationPreferences: profileData.communicationPreferences
                }
            },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: error.message });
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

// Transfer money between users
router.post('/transfer', async (req, res) => {
    try {
        const { fromEmail, toAccountNumber, amount } = req.body;

        if (!fromEmail || !toAccountNumber || !amount) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const sender = await User.findOne({ email: fromEmail });
        const receiver = await User.findOne({ accountNumber: toAccountNumber });

        if (!sender || !receiver) {
            return res.status(404).json({ error: 'Sender or receiver not found' });
        }

        const numericAmount = parseFloat(amount);
        if (isNaN(numericAmount) || numericAmount <= 0) {
            return res.status(400).json({ error: 'Invalid amount' });
        }

        if (sender.balance < numericAmount) {
            return res.status(400).json({ error: 'Insufficient funds' });
        }

        // Generate unique transaction ID
        const transactionId = `TR-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;

        // Update balances
        sender.balance -= numericAmount;
        receiver.balance += numericAmount;

        // Record transactions with detailed tracing
        const transactionDate = new Date();
        const senderTransaction = {
            type: 'transfer-sent',
            amount: numericAmount,
            date: transactionDate,
            from: sender.email,
            to: receiver.email,
            transactionId: transactionId,
            status: 'completed'
        };

        const receiverTransaction = {
            type: 'transfer-received',
            amount: numericAmount,
            date: transactionDate,
            from: sender.email,
            to: receiver.email,
            transactionId: transactionId,
            status: 'completed'
        };

        sender.transactions.push(senderTransaction);
        receiver.transactions.push(receiverTransaction);

        await sender.save();
        await receiver.save();

        // Log transaction details with tracing
        console.log('Transfer Trace:', {
            transactionId,
            sender: sender.email,
            receiver: receiver.email,
            amount: numericAmount,
            timestamp: transactionDate
        });

        res.json({ 
            message: 'Transfer successful',
            transactionId: transactionId,
            details: {
                sender: sender.email,
                receiver: receiver.email,
                amount: numericAmount
            }
        });
    } catch (error) {
        console.error('Transfer error:', error);
        res.status(500).json({ 
            error: 'Transfer failed', 
            details: error.message 
        });
    }
});

module.exports = router;