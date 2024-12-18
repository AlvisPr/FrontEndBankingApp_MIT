const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const auth = async (req, res, next) => {
    try {
        // Get token from header
        const token = req.header('Authorization')?.replace('Bearer ', '');
        console.log('Received token:', token);
        
        if (!token) {
            console.log('No token provided');
            return res.status(401).json({ error: 'No authentication token, access denied' });
        }

        try {
            // Verify token with JWT_SECRET
            const decoded = jwt.verify(token, JWT_SECRET);
            console.log('Decoded token:', decoded);
            
            if (!decoded || !decoded.userId) {
                console.log('Invalid token format:', decoded);
                return res.status(401).json({ error: 'Invalid token format' });
            }

            // Find user
            const user = await User.findById(decoded.userId);
            if (!user) {
                console.log('User not found for ID:', decoded.userId);
                return res.status(401).json({ error: 'User not found' });
            }

            req.user = {
                userId: decoded.userId,
                email: decoded.email,
                accountNumber: decoded.accountNumber,
                isGoogleUser: user.isGoogleUser
            };
            console.log('Token verified successfully for user:', req.user);
            next();
        } catch (error) {
            console.error('Token verification failed:', error);
            return res.status(401).json({ error: 'Token verification failed' });
        }
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({ error: 'Internal server error during authentication' });
    }
};

module.exports = auth;
