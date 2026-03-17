const mongoose = require('mongoose');

/**
 * FacilityReview
 * Normalized reviews collection — separate from SportFacility so ratings
 * can be paginated, aggregated, and updated independently.
 */
const facilityReviewSchema = new mongoose.Schema({
    facility_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SportFacility',
        required: true
    },
    reviewer_user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reservation_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reservation',
        default: null  // Optional: ties review to a real booking for verification
    },
    rating_score: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    review_title: {
        type: String,
        default: '',
        trim: true
    },
    review_body: {
        type: String,
        default: '',
        trim: true
    },
    is_anonymous: {
        type: Boolean,
        default: false  // If true, reviewer name is hidden in the UI
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    collection: 'facility_reviews'
});

// One review per user per facility
facilityReviewSchema.index(
    { facility_id: 1, reviewer_user_id: 1 },
    { unique: true }
);

const FacilityReview = mongoose.model('FacilityReview', facilityReviewSchema);

module.exports = FacilityReview;
