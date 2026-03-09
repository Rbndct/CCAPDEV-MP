const mongoose = require('mongoose');

const facilitySchema = new mongoose.Schema({
    name: {
        type: String, // e.g., "Basketball Court 1"
        required: true,
        unique: true,
        trim: true
    },
    type: {
        type: String, // e.g., "Basketball", "Tennis"
        required: true
    },
    capacity: {
        type: Number,
        required: true,
        min: 1
    },
    hourly_rate: {
        type: Number,
        required: true,
        default: 500
    },
    status: {
        type: String,
        enum: ['available', 'maintenance', 'closed'],
        default: 'available'
    },
    description: {
        type: String,
        default: ''
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const Facility = mongoose.model('Facility', facilitySchema);

module.exports = Facility;
