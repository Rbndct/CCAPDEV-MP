const express = require('express');
const router = express.Router();
const SportFacility = require('../models/SportFacility');
const FacilityOperatingSchedule = require('../models/FacilityOperatingSchedule');
const Reservation = require('../models/Reservation');
const User = require('../models/User');
const FacilityReview = require('../models/FacilityReview');
const { verifyToken, isAdminOrStaff } = require('../middleware/auth');

// All routes below require a valid JWT and admin/staff role
router.use(verifyToken, isAdminOrStaff);

// ─── Facilities ─────────────────────────────────────────────────────────────

// GET /api/admin/facilities
router.get('/facilities', async (req, res) => {
    try {
        const facilities = await SportFacility.find().sort({ facility_name: 1 });
        res.json(facilities);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching facilities.', error: err.message });
    }
});

// POST /api/admin/facilities
router.post('/facilities', async (req, res) => {
    try {
        const {
            facility_name, facility_type, facility_description, facility_location,
            facility_image_url, facility_images, facility_amenities,
            facility_surface, facility_size,
            total_capacity, total_bookable_slots, hourly_rate_php,
            min_booking_hours, max_booking_hours, advance_booking_days,
            facility_status
        } = req.body;

        const facility = await SportFacility.create({
            facility_name, facility_type, facility_description, facility_location,
            facility_image_url, facility_images, facility_amenities,
            facility_surface, facility_size,
            total_capacity, total_bookable_slots, hourly_rate_php,
            min_booking_hours, max_booking_hours, advance_booking_days,
            facility_status: facility_status?.toLowerCase() || 'available'
        });
        res.status(201).json(facility);
    } catch (err) {
        res.status(500).json({ message: 'Error creating facility.', error: err.message });
    }
});

// PUT /api/admin/facilities/:id
router.put('/facilities/:id', async (req, res) => {
    try {
        const {
            facility_name, facility_type, facility_description, facility_location,
            facility_image_url, facility_images, facility_amenities,
            facility_surface, facility_size,
            total_capacity, total_bookable_slots, hourly_rate_php,
            min_booking_hours, max_booking_hours, advance_booking_days,
            facility_status
        } = req.body;

        const updatePayload = {
            facility_name, facility_type, facility_description, facility_location,
            facility_image_url, facility_images, facility_amenities,
            facility_surface, facility_size,
            total_capacity, total_bookable_slots, hourly_rate_php,
            min_booking_hours, max_booking_hours, advance_booking_days,
        };
        if (facility_status) updatePayload.facility_status = facility_status.toLowerCase();

        const updated = await SportFacility.findByIdAndUpdate(
            req.params.id, updatePayload, { new: true, runValidators: true }
        );
        if (!updated) return res.status(404).json({ message: 'Facility not found.' });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: 'Error updating facility.', error: err.message });
    }
});

// DELETE /api/admin/facilities/:id
router.delete('/facilities/:id', async (req, res) => {
    try {
        const deleted = await SportFacility.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Facility not found.' });
        // Also clean up associated schedules
        await FacilityOperatingSchedule.deleteMany({ facility_id: req.params.id });
        res.json({ message: 'Facility deleted successfully.' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting facility.', error: err.message });
    }
});

// ─── Operating Schedules ─────────────────────────────────────────────────────

// GET /api/admin/facilities/:id/schedule
router.get('/facilities/:id/schedule', async (req, res) => {
    try {
        const schedule = await FacilityOperatingSchedule.find({ facility_id: req.params.id })
            .sort({ day_of_week: 1 });
        res.json(schedule);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching schedule.', error: err.message });
    }
});

// PUT /api/admin/facilities/:id/schedule/:day
router.put('/facilities/:id/schedule/:day', async (req, res) => {
    try {
        const { open_time, close_time, is_closed, is_maintenance, maintenance_note } = req.body;
        const updated = await FacilityOperatingSchedule.findOneAndUpdate(
            { facility_id: req.params.id, day_of_week: req.params.day },
            { open_time, close_time, is_closed, is_maintenance, maintenance_note },
            { new: true, runValidators: true }
        );
        if (!updated) return res.status(404).json({ message: 'Schedule entry not found.' });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: 'Error updating schedule.', error: err.message });
    }
});

// ─── Reservations ────────────────────────────────────────────────────────────

// GET /api/admin/reservations
router.get('/reservations', async (req, res) => {
    try {
        const reservations = await Reservation.find()
            .populate('facility', 'facility_name facility_type')
            .populate('user', 'full_name email')
            .populate('reserved_by', 'full_name email')
            .sort({ date: 1, start_time: 1 });
        res.json(reservations);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching reservations.', error: err.message });
    }
});

// POST /api/admin/reservations/walk-in
router.post('/reservations/walk-in', async (req, res) => {
    try {
        const { walk_in_name, facility, seat_number, date, start_time, end_time } = req.body;

        if (!walk_in_name || !facility || !date || !start_time || !end_time) {
            return res.status(400).json({ message: 'Missing required fields.' });
        }

        // Overlap check
        const conflict = await Reservation.findOne({
            facility,
            seat_number: seat_number || 1,
            date: new Date(date),
            start_time,
            status: { $in: ['reserved', 'blocked'] },
        });
        if (conflict) {
            return res.status(409).json({ message: 'This slot is already booked or blocked.' });
        }

        const reservation = await Reservation.create({
            walk_in_name,
            facility,
            seat_number: seat_number || 1,
            date: new Date(date),
            start_time,
            end_time,
            reserved_by: req.userId,
            status: 'reserved',
        });

        res.status(201).json(reservation);
    } catch (err) {
        res.status(500).json({ message: 'Error creating walk-in reservation.', error: err.message });
    }
});

// POST /api/admin/facilities/block
router.post('/facilities/block', async (req, res) => {
    try {
        const { facility, seat_number, date, start_time, end_time, reason } = req.body;

        const block = await Reservation.create({
            walk_in_name: `BLOCKED: ${reason || 'Maintenance'}`,
            facility,
            seat_number: seat_number || 1,
            date: new Date(date),
            start_time,
            end_time,
            reserved_by: req.userId,
            status: 'blocked',
        });

        res.status(201).json(block);
    } catch (err) {
        res.status(500).json({ message: 'Error blocking slot.', error: err.message });
    }
});

// PUT /api/admin/reservations/:id
router.put('/reservations/:id', async (req, res) => {
    try {
        const updated = await Reservation.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ message: 'Reservation not found.' });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: 'Error updating reservation.', error: err.message });
    }
});

// DELETE /api/admin/reservations/:id
router.delete('/reservations/:id', async (req, res) => {
    try {
        const deleted = await Reservation.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Reservation not found.' });
        res.json({ message: 'Reservation deleted successfully.' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting reservation.', error: err.message });
    }
});

// ─── Facility Reviews (Testing/Seeding) ────────────────────────────────────
// Seed reviews for a single facility so the Facility Detail page can be tested.
// POST /api/admin/facilities/:id/reviews/seed
// Body: { count?: number, is_anonymous?: boolean, ratingRange?: [min,max], title_prefix?: string, body_prefix?: string }
router.post('/facilities/:id/reviews/seed', async (req, res) => {
    try {
        const facilityId = req.params.id;
        const {
            count = 3,
            is_anonymous = false,
            ratingRange = [1, 5],
            title_prefix = 'Test Review',
            body_prefix = 'This is a seeded test review to verify the facility reviews UI.'
        } = req.body || {};

        const facilityExists = await SportFacility.findById(facilityId).select('_id');
        if (!facilityExists) return res.status(404).json({ message: 'Facility not found.' });

        const safeCount = Math.max(0, Math.min(Number(count) || 0, 25));
        if (safeCount === 0) return res.json({ seeded: 0, facilityId });

        const minRating = Math.max(1, Number(ratingRange?.[0]) || 1);
        const maxRating = Math.min(5, Number(ratingRange?.[1]) || 5);

        const users = await User.find().select('_id').limit(safeCount);
        const reviewers = users.map(u => u._id);

        const seeded = [];
        for (let i = 0; i < reviewers.length; i++) {
            const reviewer_user_id = reviewers[i];
            const rating_score = Math.floor(Math.random() * (maxRating - minRating + 1)) + minRating;
            const review_title = `${title_prefix} ${i + 1}`;
            const review_body = `${body_prefix} (${i + 1})`;

            const review = await FacilityReview.findOneAndUpdate(
                { facility_id: facilityId, reviewer_user_id },
                {
                    $set: {
                        rating_score,
                        review_title,
                        review_body,
                        is_anonymous: !!is_anonymous
                    }
                },
                { new: true, upsert: true }
            );
            seeded.push(review);
        }

        res.json({
            seeded: seeded.length,
            facilityId,
            reviews: seeded.map(r => ({
                _id: r._id,
                facility_id: r.facility_id,
                reviewer_user_id: r.reviewer_user_id,
                rating: r.rating_score,
                title: r.review_title,
                body: r.review_body,
                is_anonymous: r.is_anonymous,
                date: r.created_at
            }))
        });
    } catch (err) {
        res.status(500).json({ message: 'Error seeding facility reviews.', error: err.message });
    }
});

// Seed reviews for every facility (handy for quick UI testing).
// POST /api/admin/facilities/reviews/seed-all
// Body: { countPerFacility?: number, limitFacilities?: number, is_anonymous?: boolean }
router.post('/facilities/reviews/seed-all', async (req, res) => {
    try {
        const {
            countPerFacility = 3,
            limitFacilities = 50,
            is_anonymous = false
        } = req.body || {};

        const safeLimitFacilities = Math.max(0, Math.min(Number(limitFacilities) || 0, 200));
        const safeCountPerFacility = Math.max(0, Math.min(Number(countPerFacility) || 0, 25));

        const facilities = await SportFacility.find().select('_id').limit(safeLimitFacilities);
        const facilityIds = facilities.map(f => f._id);

        const seededByFacility = [];
        for (let facilityIndex = 0; facilityIndex < facilityIds.length; facilityIndex++) {
            const facilityId = facilityIds[facilityIndex];
            const seeded = [];

            // Pick users who haven't reviewed this specific facility yet.
            const existingReviewerIds = await FacilityReview.distinct('reviewer_user_id', { facility_id: facilityId });
            const users = await User.find({ _id: { $nin: existingReviewerIds } })
                .select('_id')
                .limit(safeCountPerFacility);
            const reviewerIds = users.map(u => u._id);

            for (let i = 0; i < reviewerIds.length; i++) {
                const reviewer_user_id = reviewerIds[i];
                const rating_score = Math.floor(Math.random() * 5) + 1;
                const review_title = `Test Review ${facilityIndex + 1}-${i + 1}`;
                const review_body = `Seeded test review for facility ${facilityIndex + 1} (${i + 1}).`;

                const review = await FacilityReview.findOneAndUpdate(
                    { facility_id: facilityId, reviewer_user_id },
                    {
                        $set: {
                            rating_score,
                            review_title,
                            review_body,
                            is_anonymous: !!is_anonymous
                        }
                    },
                    { new: true, upsert: true }
                );
                seeded.push(review);
            }

            seededByFacility.push({ facilityId, seeded: seeded.length });
        }

        res.json({ facilities: facilityIds.length, seededByFacility });
    } catch (err) {
        res.status(500).json({ message: 'Error seeding all facility reviews.', error: err.message });
    }
});

// ─── Stats ───────────────────────────────────────────────────────────────────

// GET /api/admin/stats  — aggregated dashboard stats
router.get('/stats', async (req, res) => {
    try {
        const [totalFacilities, totalUsers, reservations] = await Promise.all([
            SportFacility.countDocuments(),
            User.countDocuments(),
            Reservation.find().populate('facility', 'hourly_rate_php')
        ]);

        const noShows = reservations.filter(r => r.status === 'no-show').length;
        const activeBookings = reservations.filter(r => ['reserved', 'confirmed', 'pending'].includes(r.status)).length;

        // Revenue: sum of (duration * hourly_rate) for confirmed/completed reservations
        let totalRevenue = 0;
        for (const r of reservations) {
            if (!['confirmed', 'completed', 'reserved'].includes(r.status)) continue;
            const parseTime = (t) => { const [h, m] = String(t || '').split(':').map(Number); return isNaN(h) ? null : h * 60 + (m || 0); };
            const start = parseTime(r.start_time);
            const end = parseTime(r.end_time);
            const rate = Number(r.facility?.hourly_rate_php || 0);
            if (start !== null && end !== null && end > start && rate > 0) {
                totalRevenue += ((end - start) / 60) * rate;
            }
        }

        // Occupancy rate: booked slots in last 7 days / (facilities * 12 operating hours * 7 days)
        const now = new Date();
        const sevenDaysAgo = new Date(now); sevenDaysAgo.setDate(now.getDate() - 7);
        const recentActiveReservations = reservations.filter(r =>
            ['reserved', 'confirmed', 'pending', 'completed'].includes(r.status) &&
            new Date(r.date) >= sevenDaysAgo && new Date(r.date) <= now
        );
        const totalBookedHours = recentActiveReservations.reduce((sum, r) => {
            const parseTime = (t) => { const [h, m] = String(t || '').split(':').map(Number); return isNaN(h) ? null : h * 60 + (m || 0); };
            const s = parseTime(r.start_time), e = parseTime(r.end_time);
            if (s !== null && e !== null && e > s) return sum + (e - s) / 60;
            return sum;
        }, 0);
        const totalPossibleHours = Math.max(totalFacilities * 12 * 7, 1); // 12hr/day * 7 days
        const occupancyRate = Math.min(Math.round((totalBookedHours / totalPossibleHours) * 100), 100);

        res.json({
            totalRevenue: Math.round(totalRevenue),
            activeBookings,
            noShows,
            totalFacilities,
            totalUsers,
            occupancyRate
        });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching stats.', error: err.message });
    }
});

// ─── Users ───────────────────────────────────────────────────────────────────

// GET /api/admin/users  — list all users with booking counts
router.get('/users', async (req, res) => {
    try {
        const users = await User.find().select('-password_hash').sort({ created_at: -1 });

        // Get booking counts for all users in one aggregation
        const bookingCounts = await Reservation.aggregate([
            { $match: { user: { $ne: null } } },
            { $group: { _id: '$user', count: { $sum: 1 } } }
        ]);
        const countMap = {};
        bookingCounts.forEach(({ _id, count }) => { countMap[String(_id)] = count; });

        const enriched = users.map(u => ({
            ...u.toObject(),
            booking_count: countMap[String(u._id)] || 0
        }));

        res.json(enriched);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching users.', error: err.message });
    }
});

module.exports = router;