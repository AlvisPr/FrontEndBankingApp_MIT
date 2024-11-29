const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    try {
        // Get token from header
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ error: 'No authentication token, access denied' });
        }

        // Decode token without verification to get user ID and session ID
        const decoded = jwt.decode(token);
        if (!decoded || !decoded.userId || !decoded.sessionId) {
            return res.status(401).json({ error: 'Invalid token format' });
        }

        // Find user and their active session
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        // Clean up expired sessions
        await user.cleanExpiredSessions();

        // Find the specific session
        const session = user.activeSessions.find(s => 
            s._id.toString() === decoded.sessionId
        );

        if (!session) {
            return res.status(401).json({ error: 'Session not found or expired' });
        }

        // Verify token with session-specific secret
        try {
            const verified = jwt.verify(token, session.secret);
            req.user = {
                ...verified,
                sessionId: decoded.sessionId
            };
            next();
        } catch (error) {
            return res.status(401).json({ error: 'Token verification failed' });
        }
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({ error: 'Internal server error during authentication' });
    }
};

module.exports = auth;
