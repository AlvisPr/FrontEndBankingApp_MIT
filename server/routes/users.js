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

// Helper function to generate account number
const generateAccountNumber = () => {
    return Math.random().toString().slice(2, 19).padStart(17, '0');
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
        const { name, email, password, isGoogleUser = false, googleId = null } = req.body;

        if (!name || !email || (!isGoogleUser && !password)) {
            return res.status(400).json({ 
                success: false,
                error: 'Required fields missing' 
            });
        }

        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ 
                success: false,
                error: 'Email already registered' 
            });
        }

        // Generate account number
        const accountNumber = generateAccountNumber();

        const userData = {
            name,
            email: email.toLowerCase(),
            accountNumber,
            isGoogleUser,
            googleId
        };

        if (!isGoogleUser) {
            userData.password = await bcrypt.hash(password, 10);
        }

        const user = new User(userData);
        await user.save();

        // Generate JWT token for immediate login
        const token = jwt.sign(
            { 
                userId: user._id,
                email: user.email,
                accountNumber: user.accountNumber
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                balance: user.balance,
                accountNumber: user.accountNumber,
                isGoogleUser: user.isGoogleUser,
                isAdmin: user.isAdmin
            }
        });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ 
            success: false,
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
                success: false,
                error: 'Email and password are required'
            });
        }

        // Find user by email
        const user = await User.findOne({ email: email.toLowerCase() });
        
        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Invalid email or password'
            });
        }

        // Use bcrypt to compare the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                error: 'Invalid email or password'
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { 
                userId: user._id,
                email: user.email,
                accountNumber: user.accountNumber
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Return user without password and include token
        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                balance: user.balance,
                accountNumber: user.accountNumber,
                isAdmin: user.isAdmin,
                transactions: user.transactions || []
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
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

        // Get the latest transaction
        const latestTransaction = user.transactions[user.transactions.length - 1];

        res.json({
            success: true,
            newBalance: user.balance,
            transaction: {
                type: normalizedType,
                amount: numericAmount,
                balance: newBalance,
                date: latestTransaction.date
            }
        });

    } catch (error) {
        console.error('Transaction error:', {
            message: error.message,
            stack: error.stack
        });
        res.status(500).json({
            success: false,
            error: 'Transaction failed',
            details: error.message
        });
    }
});

// Get user transactions
router.get('/:userId/transactions', async (req, res) => {
    try {
        const { userId } = req.params;

        // Validate userId format
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid user ID format',
                userId
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found',
                userId
            });
        }

        // Return transactions in reverse chronological order
        const transactions = user.transactions || [];
        transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

        res.json(transactions);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch transactions',
            details: error.message
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
            return res.status(400).json({
                success: false,
                error: 'Missing required fields',
                details: 'fromEmail, toAccountNumber, and amount are required'
            });
        }

        const numericAmount = parseFloat(amount);
        if (isNaN(numericAmount) || numericAmount <= 0) {
            return res.status(400).json({
                success: false,
                error: 'Invalid amount',
                details: 'Amount must be a positive number'
            });
        }

        // Find sender and recipient
        const sender = await User.findOne({ email: fromEmail });
        const recipient = await User.findOne({ accountNumber: toAccountNumber });

        if (!sender || !recipient) {
            return res.status(404).json({
                success: false,
                error: 'User not found',
                details: !sender ? 'Sender not found' : 'Recipient not found'
            });
        }

        if (sender.balance < numericAmount) {
            return res.status(400).json({
                success: false,
                error: 'Insufficient funds',
                details: 'Sender does not have enough balance for this transfer'
            });
        }

        // Update balances
        sender.balance -= numericAmount;
        recipient.balance += numericAmount;

        // Create transaction records
        const timestamp = new Date();

        // Sender's transaction
        sender.transactions.push({
            type: 'transfer-sent',
            amount: numericAmount,
            date: timestamp,
            balance: sender.balance,
            description: `Transfer to ${recipient.name}`,
            toAccount: recipient.accountNumber,
            toEmail: recipient.email,
            toName: recipient.name,
            fromEmail: sender.email,
            fromName: sender.name
        });

        // Recipient's transaction
        recipient.transactions.push({
            type: 'transfer-received',
            amount: numericAmount,
            date: timestamp,
            balance: recipient.balance,
            description: `Transfer from ${sender.name}`,
            fromAccount: sender.accountNumber,
            fromEmail: sender.email,
            fromName: sender.name,
            toEmail: recipient.email,
            toName: recipient.name
        });

        // Save both users
        await Promise.all([sender.save(), recipient.save()]);

        res.json({
            success: true,
            message: 'Transfer successful',
            newBalance: sender.balance,
            transaction: sender.transactions[sender.transactions.length - 1]
        });

    } catch (error) {
        console.error('Transfer error:', error);
        res.status(500).json({
            success: false,
            error: 'Transfer failed',
            details: error.message
        });
    }
});

// Google Authentication login/register
router.post('/google-auth', async (req, res) => {
    try {
        const { email, name, googleId } = req.body;

        if (!email || !name || !googleId) {
            return res.status(400).json({
                success: false,
                error: 'Email, name, and googleId are required'
            });
        }

        let user = await User.findOne({ 
            $or: [
                { email: email.toLowerCase() },
                { googleId }
            ]
        });

        if (user) {
            // Update existing user's Google ID if not set
            if (!user.googleId) {
                user.googleId = googleId;
                user.isGoogleUser = true;
                await user.save();
            }
        } else {
            // Create new user with Google auth
            const accountNumber = generateAccountNumber();
            user = new User({
                name,
                email: email.toLowerCase(),
                googleId,
                isGoogleUser: true,
                accountNumber
            });
            await user.save();
        }

        // Generate JWT token
        const token = jwt.sign(
            { 
                userId: user._id,
                email: user.email,
                accountNumber: user.accountNumber
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                balance: user.balance,
                accountNumber: user.accountNumber,
                isGoogleUser: user.isGoogleUser,
                isAdmin: user.isAdmin
            }
        });
    } catch (error) {
        console.error('Google auth error:', error);
        res.status(500).json({
            success: false,
            error: 'Google authentication failed',
            details: error.message
        });
    }
});

// Add transaction
router.post('/:userId/transaction', async (req, res) => {
    try {
        const { userId } = req.params;
        const { type, amount } = req.body;

        if (!userId || !type || !amount) {
            return res.status(400).json({ error: 'User ID, transaction type, and amount are required' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        let newBalance;
        if (type === 'deposit') {
            newBalance = user.balance + amount;
        } else if (type === 'withdraw') {
            if (user.balance < amount) {
                return res.status(400).json({ error: 'Insufficient funds' });
            }
            newBalance = user.balance - amount;
        } else {
            return res.status(400).json({ error: 'Invalid transaction type' });
        }

        // Create transaction record
        const transaction = {
            type,
            amount,
            balance: newBalance,
            date: new Date()
        };

        // Update user
        user.balance = newBalance;
        user.transactions.push(transaction);
        user.updatedAt = new Date();
        await user.save();

        res.json({
            success: true,
            transaction,
            newBalance
        });
    } catch (error) {
        console.error('Transaction error:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;