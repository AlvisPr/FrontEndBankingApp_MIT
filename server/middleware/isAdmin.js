// middleware/isAdmin.js
const User = require('../models/User');

const isAdmin = async (req, res, next) => {
    try {
        console.log('isAdmin middleware called');
        const user = await User.findById(req.userId);
        if (user && user.isAdmin) {
            console.log('User is admin:', user.email);
            next();
        } else {
            console.log('Access denied for user:', user ? user.email : 'Unknown');
            res.status(403).json({ error: 'Access denied' });
        }
    } catch (error) {
        console.error('Error in isAdmin middleware:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = isAdmin;