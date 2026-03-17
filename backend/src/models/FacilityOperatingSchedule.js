const mongoose = require('mongoose');

/**
 * FacilityOperatingSchedule
 * One document per day per facility (7 docs per facility).
 * Admin can toggle is_maintenance + add a note without deleting the schedule.
 * Compound unique index prevents duplicate day entries per facility.
 */
const facilityOperatingScheduleSchema = new mongoose.Schema({
    facility_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SportFacility',
        required: true
    },
    day_of_week: {
        type: String,
        enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
        required: true
    },
    open_time: {
        type: String,  // 24h format, e.g. "07:00"
        required: function () { return !this.is_closed; }
    },
    close_time: {
        type: String,  // 24h format, e.g. "21:00"
        required: function () { return !this.is_closed; }
    },
    is_closed: {
        type: Boolean,
        default: false  // true = facility fully closed this day (e.g. holiday)
    },
    is_maintenance: {
        type: Boolean,
        default: false  // true = admin-blocked for maintenance; shown to users
    },
    maintenance_note: {
        type: String,
        default: ''  // Reason shown to users when is_maintenance is true
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    collection: 'facility_operating_schedules'
});

// Compound unique index: one schedule entry per day per facility
facilityOperatingScheduleSchema.index(
    { facility_id: 1, day_of_week: 1 },
    { unique: true }
);

const FacilityOperatingSchedule = mongoose.model(
    'FacilityOperatingSchedule',
    facilityOperatingScheduleSchema
);

module.exports = FacilityOperatingSchedule;
