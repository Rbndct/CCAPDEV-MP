const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateToken } = require('../middleware/auth');

// POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { full_name, email, password, phone_number } = req.body;

        if (!email || !email.includes('@')) {
            return res.status(400).json({ message: 'Please provide a valid email address.' });
        }

        const existing = await User.findOne({ email: email.toLowerCase() });
        if (existing) {
            return res.status(400).json({ message: 'An account with this email already exists.' });
        }

        const password_hash = await bcrypt.hash(password, 10);

        const user = await User.create({
            full_name,
            email: email.toLowerCase(),
            password_hash,
            phone_number,
            role: 'student',
            is_verified: true,
        });

        res.status(201).json({ message: 'Registration successful! You can now log in.' });
    } catch (err) {
        res.status(500).json({ message: 'Registration failed.', error: err.message });
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password, rememberMe } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const token = generateToken(user._id, !!rememberMe);

        if (rememberMe) {
            res.cookie('token', token, {
                httpOnly: true,
                maxAge: 21 * 24 * 60 * 60 * 1000, // 21 days
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
            });
        }

        res.json({
            token,
            user: {
                id: user._id,
                full_name: user.full_name,
                email: user.email,
                role: user.role,
                avatar_url: user.avatar_url,
                bio: user.bio,
            },
        });
    } catch (err) {
        res.status(500).json({ message: 'Login failed.', error: err.message });
    }
});

module.exports = router;
