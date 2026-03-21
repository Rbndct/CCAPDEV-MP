const express = require('express');
const router = express.Router();
const SportFacility = require('../models/SportFacility');
const Reservation = require('../models/Reservation');
const FacilityOperatingSchedule = require('../models/FacilityOperatingSchedule');
const FacilityReview = require('../models/FacilityReview');
const { verifyToken } = require('../middleware/auth');

/** Normalize date to midnight local for consistent comparison */
function normalizeDate(d) {
    const date = d instanceof Date ? d : new Date(d);
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0);
    return normalized;
}

/** Check if two time ranges overlap (times as "HH:mm" strings) */
function timesOverlap(startA, endA, startB, endB) {
    return startA < endB && startB < endA;
}

function parseTimeToMinutes(timeStr) {
    const [hRaw, mRaw] = String(timeStr).split(':');
    const h = Number(hRaw);
    const m = Number(mRaw);
    if (Number.isNaN(h) || Number.isNaN(m)) return null;
    return h * 60 + m;
}

function reservationStartDateTime(reservation) {
    const d = normalizeDate(reservation.date);
    const startMinutes = parseTimeToMinutes(reservation.start_time);
    if (startMinutes === null) return null;
    const h = Math.floor(startMinutes / 60);
    const m = startMinutes % 60;
    d.setHours(h, m, 0, 0);
    return d;
}

function withinLastHours(startDateTime, hours) {
    if (!startDateTime) return false;
    const now = new Date();
    const diffMs = startDateTime.getTime() - now.getTime();
    return diffMs <= hours * 60 * 60 * 1000;
}

async function computeCancellationFee(reservation) {
    // Industry-standard-ish last-minute fee example: 20% of the booking total.
    const cancellationFeePercent = 20;

    const facility = await SportFacility.findById(reservation.facility).select('hourly_rate_php');
    const hourlyRate = Number(facility?.hourly_rate_php || 0);

    const startMinutes = parseTimeToMinutes(reservation.start_time);
    const endMinutes = parseTimeToMinutes(reservation.end_time);
    if (hourlyRate <= 0 || startMinutes === null || endMinutes === null || endMinutes <= startMinutes) {
        return {
            fee_percent: cancellationFeePercent,
            fee_amount: null,
            currency: 'PHP'
        };
    }

    const durationHours = (endMinutes - startMinutes) / 60;
    const total = hourlyRate * durationHours;
    // Use ceil so the fee isn't accidentally undercharged due to rounding.
    const feeAmount = Math.ceil(total * (cancellationFeePercent / 100));

    return {
        fee_percent: cancellationFeePercent,
        fee_amount: feeAmount,
        currency: 'PHP'
    };
}

// ─── Public ──────────────────────────────────────────────────────────────────

// GET /api/reservations/facilities  — list all facilities (public)
router.get('/facilities', async (req, res) => {
    try {
        const facilities = await SportFacility.find().sort({ facility_name: 1 }).lean();
        
        const reviewsAgg = await FacilityReview.aggregate([
            {
                $group: {
                    _id: '$facility_id',
                    averageRating: { $avg: '$rating_score' },
                    reviewCount: { $sum: 1 }
                }
            }
        ]);
        
        const reviewMap = {};
        reviewsAgg.forEach(r => {
            reviewMap[r._id.toString()] = r;
        });
        
        const enrichedFacilities = facilities.map(f => {
            const stats = reviewMap[f._id.toString()] || { averageRating: 0, reviewCount: 0 };
            return {
                ...f,
                rating: stats.averageRating > 0 ? Number(stats.averageRating.toFixed(1)) : 'New',
                reviews: stats.reviewCount
            };
        });

        res.json(enrichedFacilities);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching facilities.', error: err.message });
    }
});

// GET /api/reservations/facilities/:id  — get single facility (public)
router.get('/facilities/:id', async (req, res) => {
    try {
        const facility = await SportFacility.findById(req.params.id);
        if (!facility) {
            return res.status(404).json({ message: 'Facility not found.' });
        }
        res.json(facility);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching facility.', error: err.message });
    }
});

// GET /api/reservations/facilities/:id/schedule  — get facility schedule (public)
router.get('/facilities/:id/schedule', async (req, res) => {
    try {
        const schedules = await FacilityOperatingSchedule.find({ facility_id: req.params.id });
        
        const dayOrder = {
          'monday': 1, 'tuesday': 2, 'wednesday': 3, 'thursday': 4,
          'friday': 5, 'saturday': 6, 'sunday': 7
        };
        schedules.sort((a, b) => dayOrder[a.day_of_week] - dayOrder[b.day_of_week]);
        
        res.json(schedules);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching schedule.', error: err.message });
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

// GET /api/reservations/facilities/:id/reviews  — get facility reviews (public)
router.get('/facilities/:id/reviews', async (req, res) => {
    try {
        const reviews = await FacilityReview.find({ facility_id: req.params.id })
            .populate('reviewer_user_id', 'full_name')
            .sort({ created_at: -1 });
            
        const formatted = reviews.map(r => ({
            _id: r._id,
            rating: r.rating_score,
            title: r.review_title,
            body: r.review_body,
            reviewerName: r.is_anonymous ? 'Anonymous' : (r.reviewer_user_id ? r.reviewer_user_id.full_name : 'Unknown User'),
            date: r.created_at
        }));
        
        res.json(formatted);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching reviews.', error: err.message });
    }
});

// ─── Protected (Student) ─────────────────────────────────────────────────────

// POST /api/reservations/facilities/:id/reviews  — leave a review (protected)
router.post('/facilities/:id/reviews', verifyToken, async (req, res) => {
    try {
        const { rating, title, body, is_anonymous } = req.body;
        
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Valid rating (1-5) is required.' });
        }
        
        const pastReservation = await Reservation.findOne({
            facility: req.params.id,
            user: req.userId,
            date: { $lt: new Date() },
            status: { $in: ['reserved', 'completed'] }
        });
        
        if (!pastReservation) {
             return res.status(403).json({ message: 'You must have a past reservation to leave a review.' });
        }

        const review = await FacilityReview.create({
            facility_id: req.params.id,
            reviewer_user_id: req.userId,
            reservation_id: pastReservation._id,
            rating_score: rating,
            review_title: title || '',
            review_body: body || '',
            is_anonymous: !!is_anonymous
        });
        
        await review.populate('reviewer_user_id', 'full_name');
        
        res.status(201).json({
            _id: review._id,
            rating: review.rating_score,
            title: review.review_title,
            body: review.review_body,
            reviewerName: review.is_anonymous ? 'Anonymous' : review.reviewer_user_id.full_name,
            date: review.created_at
        });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({ message: 'You have already reviewed this facility.' });
        }
        res.status(500).json({ message: 'Failed to submit review.', error: err.message });
    }
});

// POST /api/reservations  — student creates a reservation
router.post('/', verifyToken, async (req, res) => {
    try {
        const { facility, date, start_time, end_time, is_anonymous } = req.body;

        if (!facility || !date || !start_time || !end_time) {
            return res.status(400).json({ message: 'Missing required fields.' });
        }

        const resDate = normalizeDate(date);
        if (Number.isNaN(resDate.getTime())) {
            return res.status(400).json({ message: 'Invalid date.' });
        }

        const activeSlots = await Reservation.find({
            facility,
            date: resDate,
            status: { $in: ['reserved', 'blocked'] },
        }).select('start_time end_time');

        const conflict = activeSlots.some(slot =>
            timesOverlap(start_time, end_time, slot.start_time, slot.end_time)
        );
        if (conflict) {
            return res.status(409).json({ message: 'This slot is already taken.' });
        }

        const reservation = await Reservation.create({
            user: req.userId,
            facility,
            seat_number: 1,
            date: resDate,
            start_time,
            end_time,
            is_anonymous: !!is_anonymous,
            status: 'reserved',
        });

        res.status(201).json(reservation);
    } catch (err) {
        res.status(500).json({ message: `Reservation failed: ${err.message}`, error: err.message });
    }
});

// GET /api/reservations/my  — view own reservations
router.get('/my', verifyToken, async (req, res) => {
    try {
        const reservations = await Reservation.find({ user: req.userId })
            .populate('facility', 'facility_name facility_type hourly_rate_php')
            .sort({ date: -1, start_time: -1 });
        res.json(reservations);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching your reservations.', error: err.message });
    }
});

// PATCH /api/reservations/:id  — update own upcoming reservation
router.patch('/:id', verifyToken, async (req, res) => {
    try {
        const { date, start_time, end_time } = req.body;

        if (!date || !start_time || !end_time) {
            return res.status(400).json({ message: 'Date, start time, and end time are required.' });
        }

        const reservation = await Reservation.findOne({ _id: req.params.id, user: req.userId });
        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found or you do not own it.' });
        }

        if (['cancelled', 'completed', 'blocked'].includes(reservation.status)) {
            return res.status(400).json({ message: 'This reservation can no longer be modified.' });
        }

        const startDateTime = reservationStartDateTime(reservation);
        if (withinLastHours(startDateTime, 24)) {
            const fee = await computeCancellationFee(reservation);
            return res.status(403).json({
                message: `Modifications are not allowed within 24 hours of the scheduled start time. ${
                    fee.fee_amount !== null ? `An estimated last-minute cancellation fee of ${fee.fee_percent}% (~₱${fee.fee_amount}) would apply.` : `A last-minute cancellation fee of ${fee.fee_percent}% would apply.`
                }`,
                policy: { within_hours: 24, cancellation_fee_percent: fee.fee_percent, cancellation_fee_amount: fee.fee_amount, currency: fee.currency }
            });
        }

        const updatedDate = normalizeDate(date);
        if (Number.isNaN(updatedDate.getTime())) {
            return res.status(400).json({ message: 'Invalid reservation date.' });
        }

        const activeSlots = await Reservation.find({
            _id: { $ne: reservation._id },
            facility: reservation.facility,
            date: updatedDate,
            status: { $in: ['reserved', 'blocked'] },
        }).select('start_time end_time');

        const conflict = activeSlots.some(slot =>
            timesOverlap(start_time, end_time, slot.start_time, slot.end_time)
        );

        if (conflict) {
            return res.status(409).json({ message: 'This slot is already taken.' });
        }

        reservation.date = updatedDate;
        reservation.start_time = start_time;
        reservation.end_time = end_time;

        await reservation.save();
        await reservation.populate('facility', 'facility_name facility_type hourly_rate_php');

        res.json(reservation);
    } catch (err) {
        res.status(500).json({ message: 'Reservation update failed.', error: err.message });
    }
});

// PATCH /api/reservations/:id/cancel  — cancel own reservation (marks as cancelled, does not delete)
router.patch('/:id/cancel', verifyToken, async (req, res) => {
    try {
        const reservation = await Reservation.findOne({ _id: req.params.id, user: req.userId });
        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found or you do not own it.' });
        }

        if (reservation.status === 'cancelled') {
            return res.status(400).json({ message: 'Reservation is already cancelled.' });
        }

        const startDateTime = reservationStartDateTime(reservation);
        if (withinLastHours(startDateTime, 24)) {
            const fee = await computeCancellationFee(reservation);
            return res.status(403).json({
                message: `Cancellations are not allowed within 24 hours of the scheduled start time. ${
                    fee.fee_amount !== null ? `An estimated last-minute cancellation fee of ${fee.fee_percent}% (~₱${fee.fee_amount}) applies to this policy.` : `A last-minute cancellation fee of ${fee.fee_percent}% applies to this policy.`
                }`,
                policy: { within_hours: 24, cancellation_fee_percent: fee.fee_percent, cancellation_fee_amount: fee.fee_amount, currency: fee.currency }
            });
        }

        reservation.status = 'cancelled';
        await reservation.save();

        res.json({ message: 'Reservation cancelled successfully.', reservation });
    } catch (err) {
        res.status(500).json({ message: 'Cancellation failed.', error: err.message });
    }
});

// DELETE /api/reservations/:id  — hard delete own reservation (kept for admin/legacy use)
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const reservation = await Reservation.findOne({ _id: req.params.id, user: req.userId });
        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found or you do not own it.' });
        }

        await reservation.deleteOne();
        res.json({ message: 'Reservation deleted successfully.' });
    } catch (err) {
        res.status(500).json({ message: 'Deletion failed.', error: err.message });
    }
});

module.exports = router;
