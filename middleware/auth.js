const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ 
            error: 'Access denied. No token provided.' 
        });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = User.findById(decoded.userId);
        
        if (!user) {
            return res.status(401).json({ 
                error: 'Invalid token. User not found.' 
            });
        }

        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ 
            error: 'Invalid token.' 
        });
    }
};

const generateToken = (userId) => {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '24h' });
};

module.exports = {
    authenticateToken,
    generateToken,
    JWT_SECRET
}; 