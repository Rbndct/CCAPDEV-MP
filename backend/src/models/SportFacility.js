const mongoose = require('mongoose');

const sportFacilitySchema = new mongoose.Schema({
    facility_name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    facility_type: {
        type: String,
        required: true,
        enum: ['Basketball', 'Tennis', 'Badminton', 'Volleyball', 'Swimming', 'Gym', 'Other']
    },
    facility_description: {
        type: String,
        default: ''
    },
    facility_location: {
        type: String,
        default: ''
    },
    facility_image_url: {
        type: String,
        default: ''
    },
    facility_images: {
        type: [String],
        default: []
    },
    facility_amenities: {
        type: [String],
        default: []
    },
    facility_surface: {
        type: String,
        default: ''  // e.g. "Hardwood", "Clay", "Synthetic Grass"
    },
    facility_size: {
        type: String,
        default: ''  // e.g. "Full Court (28m x 15m)"
    },
    total_capacity: {
        type: Number,
        required: true,
        min: 1
    },
    total_bookable_slots: {
        type: Number,
        required: true,
        min: 1,
        default: 1  // # of independently reservable sub-units (e.g. 2 half-courts)
    },
    hourly_rate_php: {
        type: Number,
        required: true,
        default: 500
    },
    min_booking_hours: {
        type: Number,
        default: 1
    },
    max_booking_hours: {
        type: Number,
        default: 3
    },
    advance_booking_days: {
        type: Number,
        default: 7  // How far in advance a booking can be made
    },
    facility_status: {
        type: String,
        enum: ['available', 'maintenance', 'closed'],
        default: 'available'
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    collection: 'sport_facilities'
});

const SportFacility = mongoose.model('SportFacility', sportFacilitySchema);

module.exports = SportFacility;
