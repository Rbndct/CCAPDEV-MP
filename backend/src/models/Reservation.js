const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: function () { return !this.walk_in_name; }
    },
    walk_in_name: {
        type: String,
        required: function () { return !this.user; }
    },
    facility: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SportFacility',
        required: true
    },
    seat_number: {
        type: Number, // In sports context, this could be "Slot Number" or "Seat Number"
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    start_time: {
        type: String, // e.g., "09:00"
        required: true
    },
    end_time: {
        type: String, // e.g., "09:30"
        required: true
    },
    is_anonymous: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['reserved', 'blocked', 'cancelled', 'no-show', 'completed'],
        default: 'reserved'
    },
    payment_status: {
        type: String,
        enum: ['pending', 'paid'],
        default: 'pending'
    },
    payment_method: {
        type: String,
        enum: ['cash', 'credit', 'debit', 'gcash'],
        default: null
    },
    reserved_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Technically the Lab Technician
    },
    request_date: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    collection: 'reservations'
});

// Partial unique index: only active (reserved/blocked) reservations must be unique per slot.
// Cancelled reservations are excluded, allowing rebooking of previously cancelled slots.
reservationSchema.index(
    { facility: 1, seat_number: 1, date: 1, start_time: 1 },
    { unique: true, partialFilterExpression: { status: { $in: ['reserved', 'blocked'] } } }
);

const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;
