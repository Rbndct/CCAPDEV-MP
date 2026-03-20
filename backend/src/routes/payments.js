const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');
const { verifyToken } = require('../middleware/auth');

function parseTimeToMinutes(timeStr) {
    const [hRaw, mRaw] = String(timeStr).split(':');
    const h = Number(hRaw);
    const m = Number(mRaw || 0);
    if (Number.isNaN(h) || Number.isNaN(m)) return null;
    return h * 60 + m;
}

async function computeDueForReservation(reservation) {
    // Matches the frontend's simple checkout model:
    // due = durationHours * facilityHourlyRate + serviceFee
    const serviceFee = 50;
    const startMinutes = parseTimeToMinutes(reservation.start_time);
    const endMinutes = parseTimeToMinutes(reservation.end_time);

    if (startMinutes === null || endMinutes === null || endMinutes <= startMinutes) {
        return {
            subtotal: 0,
            serviceFee,
            totalDue: serviceFee
        };
    }

    const durationHours = (endMinutes - startMinutes) / 60;
    const hourlyRate = Number(reservation.facility?.hourly_rate_php || 0);
    const subtotal = durationHours * hourlyRate;
    const totalDue = subtotal + serviceFee;

    return {
        subtotal,
        serviceFee,
        totalDue
    };
}

// GET /api/payments/due  — list pending payments for the logged-in user
router.get('/due', verifyToken, async (req, res) => {
    try {
        const pendingReservations = await Reservation.find({
            user: req.userId,
            payment_status: 'pending',
            status: 'reserved'
        }).populate('facility', 'facility_name hourly_rate_php');

        const items = [];
        for (const r of pendingReservations) {
            const due = await computeDueForReservation(r);
            items.push({
                reservationId: r._id,
                facilityName: r.facility?.facility_name || 'Facility',
                date: r.date,
                start_time: r.start_time,
                end_time: r.end_time,
                payment_status: r.payment_status,
                ...due
            });
        }

        const totalDue = items.reduce((acc, item) => acc + Number(item.totalDue || 0), 0);
        res.json({ totalDue, items });
    } catch (err) {
        console.error('[payments] GET /due error:', err);
        res.status(500).json({ message: 'Error fetching payment due.', error: err.message });
    }
});

// POST /api/payments/:reservationId
// Simulates a successful payment for a reservation
router.post('/:reservationId', verifyToken, async (req, res) => {
    try {
        const reservationId = req.params.reservationId;
        const { paymentMethod } = req.body || {};

        // Find the reservation and ensure it belongs to the user
        const reservation = await Reservation.findOne({
            _id: reservationId,
            user: req.userId
        });

        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found or access denied.' });
        }

        if (reservation.payment_status === 'paid') {
            return res.status(400).json({ message: 'Reservation is already paid for.' });
        }

        if (reservation.status === 'cancelled') {
            return res.status(400).json({ message: 'Cannot pay for a cancelled reservation.' });
        }

        // Simulate payment processing...

        // Success! Update status
        reservation.payment_status = 'paid';
        reservation.status = 'confirmed'; // reserved -> confirmed after payment
        if (paymentMethod) reservation.payment_method = paymentMethod;

        await reservation.save();

        res.json({
            message: 'Payment simulated successfully',
            reservation
        });
    } catch (err) {
        console.error('[payments] POST /:reservationId error:', err);
        res.status(500).json({ message: 'Payment processing failed.', error: err.message });
    }
});

module.exports = router;
