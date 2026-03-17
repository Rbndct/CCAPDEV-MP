const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');
const { verifyToken } = require('../middleware/auth');

// POST /api/payments/:reservationId
// Simulates a successful payment for a reservation
router.post('/:reservationId', verifyToken, async (req, res) => {
    try {
        const reservationId = req.params.reservationId;
        
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
        
        await reservation.save();

        res.json({
            message: 'Payment simulated successfully',
            reservation
        });
    } catch (err) {
        res.status(500).json({ message: 'Payment processing failed.', error: err.message });
    }
});

module.exports = router;
