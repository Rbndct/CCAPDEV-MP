const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Reservation = require('../models/Reservation');
const { verifyToken } = require('../middleware/auth');

// GET /api/profiles/me  — own profile (protected)
router.get('/me', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password_hash');
        if (!user) return res.status(404).json({ message: 'User not found.' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching profile.', error: err.message });
    }
});

// PUT /api/profiles/me  — update own profile (protected)
router.put('/me', verifyToken, async (req, res) => {
    try {
        const { full_name, phone_number, bio, avatar_url } = req.body;

        const user = await User.findByIdAndUpdate(
            req.userId,
            { full_name, phone_number, bio, avatar_url },
            { new: true }
        ).select('-password_hash');

        if (!user) return res.status(404).json({ message: 'User not found.' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Error updating profile.', error: err.message });
    }
});

// DELETE /api/profiles/me  — delete own account (protected, cascades reservations)
router.delete('/me', verifyToken, async (req, res) => {
    try {
        await Reservation.deleteMany({ user: req.userId });
        await User.findByIdAndDelete(req.userId);
        res.json({ message: 'Account and all reservations deleted.' });
    } catch (err) {
        res.status(500).json({ message: 'Account deletion failed.', error: err.message });
    }
});

// GET /api/profiles/me/favorites  — get populated favorites (protected)
router.get('/me/favorites', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId).populate('favorites');
        if (!user) return res.status(404).json({ message: 'User not found.' });
        res.json(user.favorites);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching favorites.', error: err.message });
    }
});

// POST /api/profiles/me/favorites/:facilityId  — toggle favorite (protected)
router.post('/me/favorites/:facilityId', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ message: 'User not found.' });

        const facilityId = req.params.facilityId;
        const index = user.favorites.indexOf(facilityId);
        
        let action = '';
        if (index === -1) {
            user.favorites.push(facilityId);
            action = 'added';
        } else {
            user.favorites.splice(index, 1);
            action = 'removed';
        }
        
        await user.save();
        res.json({ message: `Facility ${action} to favorites.`, favorites: user.favorites });
    } catch (err) {
        res.status(500).json({ message: 'Error toggling favorite.', error: err.message });
    }
});

// GET /api/profiles/:id  — public profile (no auth required)
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('full_name avatar_url bio role created_at');
        if (!user) return res.status(404).json({ message: 'User not found.' });

        const reservations = await Reservation.find({
            user: req.params.id,
            is_anonymous: false,
            status: 'reserved',
        }).populate('facility', 'name type');

        res.json({ user, reservations });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching profile.', error: err.message });
    }
});

module.exports = router;
