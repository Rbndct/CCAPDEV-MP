const express = require('express');
const router = express.Router();
const SportFacility = require('../models/SportFacility');
const FacilityOperatingSchedule = require('../models/FacilityOperatingSchedule');
const Reservation = require('../models/Reservation');
const User = require('../models/User');
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

// ─── Users ───────────────────────────────────────────────────────────────────

// GET /api/admin/users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find().select('-password_hash').sort({ created_at: -1 });
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching users.', error: err.message });
    }
});

module.exports = router;
