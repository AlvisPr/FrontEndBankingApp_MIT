/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - name
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated MongoDB ID
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *         name:
 *           type: string
 *           description: User's full name
 *         accountNumber:
 *           type: string
 *           description: User's bank account number
 *         balance:
 *           type: number
 *           description: Current account balance
 *         isAdmin:
 *           type: boolean
 *           description: User's admin status
 *     Transaction:
 *       type: object
 *       required:
 *         - type
 *         - amount
 *       properties:
 *         type:
 *           type: string
 *           enum: [deposit, withdraw, transfer, transfer-sent, transfer-received]
 *         amount:
 *           type: number
 *         date:
 *           type: string
 *           format: date-time
 *         description:
 *           type: string
 */

const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { ObjectId } = mongoose.Types;
const isAdmin = require('../middleware/isAdmin');
const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const userDal = require('../dal/UserDal');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Helper function to generate a random secret
const generateSecret = () => {
    return crypto.randomBytes(64).toString('hex');
};

// Helper function to generate account number
const generateAccountNumber = () => {
    return Math.random().toString().slice(2, 19).padStart(17, '0');
};

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Server error
 */
router.get('/', async (req, res) => {
    try {
        const users = await userDal.findUsersWithoutPassword();
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /users/all:
 *   get:
 *     summary: Get all users (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Server error
 */
router.get('/all', isAdmin, async (req, res) => {
    try {
        const users = await userDal.findUsersWithoutPassword();
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid input or email already exists
 */
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, isGoogleUser = false, googleId = null } = req.body;

        if (!name || !email || (!isGoogleUser && !password)) {
            return res.status(400).json({ 
                success: false,
                error: 'Required fields missing' 
            });
        }

        const existingUser = await userDal.findUserByEmail(email.toLowerCase());
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
            isGoogleUser
        };

        if (googleId) {
            userData.googleId = googleId;
        }

        if (!isGoogleUser) {
            userData.password = await bcrypt.hash(password, 10);
        }

        const user = await userDal.createUser(userData);
        await user.save();

        // Generate JWT token for immediate login
        const token = jwt.sign(
            { 
                userId: user._id,
                email: user.email,
                accountNumber: user.accountNumber
            },
            JWT_SECRET,
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

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Invalid email or password
 */
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt for email:', email);

        // Find user by email
        const user = await userDal.findUserByEmail(email);
        console.log('User found:', user ? 'yes' : 'no');
        
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Verify password
        console.log('Attempting password comparison');
        console.log('Input password length:', password.length);
        console.log('Stored hash length:', user.password.length);
        
        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Password match:', isMatch ? 'yes' : 'no');
        
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Create token
        const token = jwt.sign(
            { 
                userId: user._id,
                email: user.email,
                accountNumber: user.accountNumber
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Add session to activeSessions array
        const session = {
            token,
            deviceInfo: req.headers['user-agent'] || 'unknown',
            ip: req.ip,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
        };

        // Update user's active sessions
        await userDal.addActiveSession(user._id, session);

        // Return user data and token
        const userData = {
            _id: user._id,
            name: user.name,
            email: user.email,
            accountNumber: user.accountNumber,
            balance: user.balance,
            isAdmin: user.isAdmin
        };

        res.json({
            success: true,
            user: userData,
            token
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
});

/**
 * @swagger
 * /users/logout:
 *   post:
 *     summary: Logout a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User logged out successfully
 *       404:
 *         description: User not found
 */
router.post('/logout', auth, async (req, res) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        const user = await userDal.findUserById(req.user.userId);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Remove the specific session from activeSessions array
        await userDal.removeActiveSession(req.user.userId, token);

        res.json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ message: 'Server error during logout' });
    }
});

/**
 * @swagger
 * /users/{userId}/transaction:
 *   post:
 *     summary: Handle transactions (deposit/withdraw)
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - amount
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [deposit, withdraw]
 *               amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Transaction successful
 *       400:
 *         description: Invalid input or insufficient funds
 *       404:
 *         description: User not found
 */
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

        const user = await userDal.findUserById(userId);
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
        const transaction = {
            type: normalizedType,
            amount: numericAmount,
            balance: newBalance,
            date: transactionDate
        };

        // Update balance and add transaction
        await userDal.updateBalance(userId, newBalance);
        const updatedUser = await userDal.addTransaction(userId, transaction);

        if (!updatedUser) {
            throw new Error('Failed to update user after transaction');
        }

        console.log('Transaction successful:', {
            userId,
            type: normalizedType,
            amount: numericAmount,
            newBalance: updatedUser.balance,
            date: formatter.format(transactionDate)
        });

        res.json({
            success: true,
            newBalance: updatedUser.balance,
            transaction: {
                type: normalizedType,
                amount: numericAmount,
                balance: newBalance,
                date: transactionDate
            }
        });

    } catch (error) {
        console.error('Transaction error:', error);
        res.status(500).json({ 
            error: 'Failed to process transaction',
            details: error.message
        });
    }
});

/**
 * @swagger
 * /users/{userId}/transactions:
 *   get:
 *     summary: Get user transactions
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: List of transactions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Transaction'
 *       404:
 *         description: User not found
 */
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

        const user = await userDal.findUserById(userId);
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

/**
 * @swagger
 * /users/{userId}/profile:
 *   patch:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *       404:
 *         description: User not found
 */
router.put('/:userId/profile', auth, async (req, res) => {
    try {
        const { userId } = req.params;
        const profileData = req.body;

        // Validate userId format
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid user ID format'
            });
        }

        // Create update object with all possible fields
        const updateData = {
            $set: {}
        };

        // Only include fields that are present in the request
        if (profileData.phoneNumber) updateData.$set.phoneNumber = profileData.phoneNumber;
        if (profileData.email) updateData.$set.email = profileData.email;
        if (profileData.preferredName) updateData.$set.preferredName = profileData.preferredName;
        if (profileData.language) updateData.$set.language = profileData.language;
        
        // Handle address fields
        if (profileData.address) {
            updateData.$set.address = {};
            if (profileData.address.street) updateData.$set.address.street = profileData.address.street;
            if (profileData.address.city) updateData.$set.address.city = profileData.address.city;
            if (profileData.address.state) updateData.$set.address.state = profileData.address.state;
            if (profileData.address.zipCode) updateData.$set.address.zipCode = profileData.address.zipCode;
        }

        // Handle communication preferences
        if (profileData.communicationPreferences) {
            updateData.$set.communicationPreferences = {};
            if (typeof profileData.communicationPreferences.emailNotifications === 'boolean') {
                updateData.$set.communicationPreferences.emailNotifications = profileData.communicationPreferences.emailNotifications;
            }
            if (typeof profileData.communicationPreferences.smsNotifications === 'boolean') {
                updateData.$set.communicationPreferences.smsNotifications = profileData.communicationPreferences.smsNotifications;
            }
            if (typeof profileData.communicationPreferences.paperlessStatements === 'boolean') {
                updateData.$set.communicationPreferences.paperlessStatements = profileData.communicationPreferences.paperlessStatements;
            }
        }

        console.log('Update data:', updateData); // Add this for debugging

        // Update user profile
        const updatedUser = await userDal.findByIdAndUpdate(userId, updateData);

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        // Remove sensitive data before sending response
        const userResponse = {
            ...updatedUser.toObject(),
            password: undefined
        };

        res.json({
            success: true,
            user: userResponse
        });
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to update profile'
        });
    }
});

/**
 * @swagger
 * /users/{userId}/password:
 *   patch:
 *     summary: Change user password
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newPassword
 *             properties:
 *               newPassword:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       404:
 *         description: User not found
 */
router.patch('/:userId/password', async (req, res) => {
    try {
        const { userId } = req.params;
        const { newPassword } = req.body;

        const user = await userDal.findUserById(userId);
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

/**
 * @swagger
 * /users/{userId}/password:
 *   put:
 *     summary: Update user password
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newPassword
 *             properties:
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Invalid request
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.put('/:userId/password', auth, isAdmin, async (req, res) => {
    try {
        const { userId } = req.params;
        const { newPassword } = req.body;

        if (!newPassword) {
            return res.status(400).json({ message: 'New password is required' });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update the user's password
        const user = await userDal.findUserById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.password = hashedPassword;
        await user.save();

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ message: 'Error updating password' });
    }
});

/**
 * @swagger
 * /users/{userId}:
 *   delete:
 *     summary: Delete user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       400:
 *         description: Invalid user ID format
 *       403:
 *         description: Admin access required
 *       404:
 *         description: User not found
 */
router.delete('/:userId', auth, isAdmin, async (req, res) => {
    try {
        const { userId } = req.params;

        // Validate userId format
        if (!ObjectId.isValid(userId)) {
            return res.status(400).json({
                error: 'Invalid user ID format',
                userId 
            });
        }

        // Check if trying to delete self
        if (userId === req.user.userId) {
            return res.status(400).json({
                error: 'Cannot delete your own account'
            });
        }

        // Delete the user
        const result = await userDal.deleteUser(userId);
        if (!result) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Log successful deletion
        console.log('User deleted successfully:', {
            deletedUserId: userId,
            adminId: req.user.userId,
            timestamp: new Date().toISOString(),
            userEmail: result.email
        });

        res.json({ 
            message: 'User deleted successfully',
            deletedUser: {
                id: result._id,
                email: result.email,
                name: result.name
            }
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Error deleting user' });
    }
});

/**
 * @swagger
 * /users/transfer:
 *   post:
 *     summary: Transfer money between accounts
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fromEmail
 *               - toAccountNumber
 *               - amount
 *             properties:
 *               fromEmail:
 *                 type: string
 *                 format: email
 *               toAccountNumber:
 *                 type: string
 *               amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Transfer successful
 *       400:
 *         description: Invalid input or insufficient funds
 *       404:
 *         description: User not found
 */
router.post('/transfer', async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    
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

        // Find sender and recipient within the transaction session
        const sender = await userDal.findUserByEmail(fromEmail);
        const recipient = await userDal.findByAccountNumber(toAccountNumber);

        if (!sender || !recipient) {
            await session.abortTransaction();
            return res.status(404).json({
                success: false,
                error: 'User not found',
                details: !sender ? 'Sender not found' : 'Recipient not found'
            });
        }

        if (sender.balance < numericAmount) {
            await session.abortTransaction();
            return res.status(400).json({
                success: false,
                error: 'Insufficient funds',
                details: 'Sender does not have enough balance for this transfer'
            });
        }

        const timestamp = new Date();

        try {
            // Update sender's balance and add transaction
            const updatedSender = await userDal.updateBalance(sender._id, sender.balance - numericAmount);
            if (!updatedSender) {
                throw new Error('Failed to update sender balance');
            }

            await userDal.addTransaction(sender._id, {
                type: 'transfer-sent',
                amount: numericAmount,
                date: timestamp,
                balance: sender.balance - numericAmount,
                description: `Transfer to ${recipient.name}`,
                toAccount: recipient.accountNumber,
                toEmail: recipient.email,
                toName: recipient.name,
                fromEmail: sender.email,
                fromName: sender.name
            });

            // Update recipient's balance and add transaction
            const updatedRecipient = await userDal.updateBalance(recipient._id, recipient.balance + numericAmount);
            if (!updatedRecipient) {
                throw new Error('Failed to update recipient balance');
            }

            await userDal.addTransaction(recipient._id, {
                type: 'transfer-received',
                amount: numericAmount,
                date: timestamp,
                balance: recipient.balance + numericAmount,
                description: `Transfer from ${sender.name}`,
                fromAccount: sender.accountNumber,
                fromEmail: sender.email,
                fromName: sender.name,
                toEmail: recipient.email,
                toName: recipient.name
            });

            await session.commitTransaction();

            res.json({
                success: true,
                message: 'Transfer successful',
                newBalance: sender.balance - numericAmount,
                transaction: {
                    type: 'transfer-sent',
                    amount: numericAmount,
                    date: timestamp,
                    description: `Transfer to ${recipient.name}`
                }
            });

        } catch (error) {
            await session.abortTransaction();
            throw error;
        }

    } catch (error) {
        await session.abortTransaction();
        console.error('Transfer error:', error);
        res.status(500).json({
            success: false,
            error: 'Transfer failed',
            details: error.message
        });
    } finally {
        session.endSession();
    }
});

/**
 * @swagger
 * /users/google-auth:
 *   post:
 *     summary: Google Authentication login/register
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - name
 *               - googleId
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               name:
 *                 type: string
 *               googleId:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in or registered successfully
 *       500:
 *         description: Server error
 */
router.post('/google-auth', async (req, res) => {
    try {
        const { email, name, googleId, photoURL } = req.body;

        if (!email || !name || !googleId) {
            return res.status(400).json({
                success: false,
                error: 'Email, name, and googleId are required'
            });
        }

        let user = await userDal.findUserByEmailOrGoogleId(email.toLowerCase(), googleId);

        if (user) {
            // Update existing user's Google ID and photo if not set
            if (!user.googleId || user.photoURL !== photoURL) {
                user = await userDal.model.findByIdAndUpdate(
                    user._id,
                    {
                        $set: {
                            googleId,
                            isGoogleUser: true,
                            photoURL: photoURL || user.photoURL
                        }
                    },
                    { new: true }
                );
            }
        } else {
            // Create new user with Google auth
            const accountNumber = generateAccountNumber();
            user = await userDal.createUser({
                name,
                email: email.toLowerCase(),
                googleId,
                isGoogleUser: true,
                photoURL,
                accountNumber,
                createdAt: new Date()
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { 
                userId: user._id,
                email: user.email,
                accountNumber: user.accountNumber
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                accountNumber: user.accountNumber,
                balance: user.balance,
                isAdmin: user.isAdmin,
                photoURL: user.photoURL,
                createdAt: user.createdAt,
                transactions: user.transactions || []
            }
        });
    } catch (error) {
        console.error('Google auth error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to authenticate with Google'
        });
    }
});

/**
 * @swagger
 * /users/{userId}/transaction:
 *   post:
 *     summary: Add transaction
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - amount
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [deposit, withdraw]
 *               amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Transaction added successfully
 *       400:
 *         description: Invalid input or insufficient funds
 *       404:
 *         description: User not found
 */
router.post('/:userId/transaction', async (req, res) => {
    try {
        const { userId } = req.params;
        const { type, amount } = req.body;

        if (!userId || !type || !amount) {
            return res.status(400).json({ error: 'User ID, transaction type, and amount are required' });
        }

        const user = await userDal.findUserById(userId);
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

/**
 * @swagger
 * /users/{userId}/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phoneNumber:
 *                 type: string
 *               email:
 *                 type: string
 *               address:
 *                 type: object
 *                 properties:
 *                   street:
 *                     type: string
 *                   city:
 *                     type: string
 *                   state:
 *                     type: string
 *                   zipCode:
 *                     type: string
 *               preferredName:
 *                 type: string
 *               language:
 *                 type: string
 *               communicationPreferences:
 *                 type: object
 *                 properties:
 *                   emailNotifications:
 *                     type: boolean
 *                   smsNotifications:
 *                     type: boolean
 *                   paperlessStatements:
 *                     type: boolean
 */
router.put('/:userId/profile', auth, async (req, res) => {
    try {
        const { userId } = req.params;
        const profileData = req.body;

        // Validate userId format
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid user ID format'
            });
        }

        // Update user profile
        const updatedUser = await userDal.findByIdAndUpdate(
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
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        // Remove sensitive data before sending response
        const userResponse = {
            ...updatedUser.toObject(),
            password: undefined
        };

        res.json({
            success: true,
            user: userResponse
        });
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to update profile'
        });
    }
});

module.exports = router;