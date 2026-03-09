const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'sportsplex-dev-secret';

/**
 * Generate a JWT token for a user.
 * @param {string} userId - The user's MongoDB _id
 * @param {boolean} rememberMe - If true, token expires in 21 days; otherwise 24h
 */
const generateToken = (userId, rememberMe = false) => {
    const expiresIn = rememberMe ? '21d' : '24h';
    return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn });
};

/**
 * Middleware: verify JWT from Authorization header or cookie.
 * Sets req.userId on success.
 */
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = (authHeader && authHeader.startsWith('Bearer '))
        ? authHeader.split(' ')[1]
        : req.cookies?.token;

    if (!token) {
        return res.status(401).json({ message: 'Authentication required. Please log in.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token. Please log in again.' });
    }
};

/**
 * Middleware: allow only admin or staff roles.
 * Must come AFTER verifyToken.
 */
const isAdminOrStaff = async (req, res, next) => {
    const User = require('../models/User');
    try {
        const user = await User.findById(req.userId).select('role');
        if (!user || (user.role !== 'admin' && user.role !== 'staff')) {
            return res.status(403).json({ message: 'Admin or Staff access required.' });
        }
        next();
    } catch (err) {
        res.status(500).json({ message: 'Authorization check failed.', error: err.message });
    }
};

module.exports = { generateToken, verifyToken, isAdminOrStaff };
