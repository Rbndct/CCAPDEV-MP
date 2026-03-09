const express = require('express');
const router = express.Router();
const Facility = require('../models/Facility');
const Reservation = require('../models/Reservation');
const { verifyToken } = require('../middleware/auth');

// ─── Public ──────────────────────────────────────────────────────────────────

// GET /api/reservations/facilities  — list all facilities (public)
router.get('/facilities', async (req, res) => {
    try {
        const facilities = await Facility.find().sort({ name: 1 });
        res.json(facilities);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching facilities.', error: err.message });
    }
});

// GET /api/reservations/facilities/:id/availability  — 7-day availability (public)
router.get('/facilities/:id/availability', async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);

        const slots = await Reservation.find({
            facility: req.params.id,
            date: { $gte: today, $lt: nextWeek },
            status: { $in: ['reserved', 'blocked'] },
        })
            .populate('user', 'full_name')
            .select('date start_time end_time status walk_in_name is_anonymous user');

        const formatted = slots.map(s => ({
            date: s.date,
            start_time: s.start_time,
            end_time: s.end_time,
            status: s.status,
            reservee: s.is_anonymous
                ? 'Anonymous'
                : (s.walk_in_name || (s.user ? s.user.full_name : 'Staff')),
        }));

        res.json(formatted);
    } catch (err) {
        res.status(500).json({ message: 'Error checking availability.', error: err.message });
    }
});

// ─── Protected (Student) ─────────────────────────────────────────────────────

// POST /api/reservations  — student creates a reservation
router.post('/', verifyToken, async (req, res) => {
    try {
        const { facility, date, start_time, end_time, is_anonymous } = req.body;

        if (!facility || !date || !start_time || !end_time) {
            return res.status(400).json({ message: 'Missing required fields.' });
        }

        const conflict = await Reservation.findOne({
            facility,
            date: new Date(date),
            start_time,
            status: { $in: ['reserved', 'blocked'] },
        });
        if (conflict) {
            return res.status(409).json({ message: 'This slot is already taken.' });
        }

        const reservation = await Reservation.create({
            user: req.userId,
            facility,
            seat_number: 1,
            date: new Date(date),
            start_time,
            end_time,
            is_anonymous: !!is_anonymous,
            status: 'reserved',
        });

        res.status(201).json(reservation);
    } catch (err) {
        res.status(500).json({ message: 'Reservation failed.', error: err.message });
    }
});

// GET /api/reservations/my  — view own reservations
router.get('/my', verifyToken, async (req, res) => {
    try {
        const reservations = await Reservation.find({ user: req.userId })
            .populate('facility', 'name type')
            .sort({ date: -1, start_time: -1 });
        res.json(reservations);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching your reservations.', error: err.message });
    }
});

// DELETE /api/reservations/:id  — cancel own reservation
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const reservation = await Reservation.findOne({ _id: req.params.id, user: req.userId });
        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found or you do not own it.' });
        }

        await reservation.deleteOne();
        res.json({ message: 'Reservation cancelled successfully.' });
    } catch (err) {
        res.status(500).json({ message: 'Cancellation failed.', error: err.message });
    }
});

module.exports = router;
