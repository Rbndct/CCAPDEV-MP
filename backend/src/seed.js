require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('./models/User');
const SportFacility = require('./models/SportFacility');
const FacilityOperatingSchedule = require('./models/FacilityOperatingSchedule');
const FacilityReview = require('./models/FacilityReview');
const Reservation = require('./models/Reservation');

// Default weekly schedule applied to every facility
const DEFAULT_WEEKLY_SCHEDULE = [
    { day_of_week: 'monday',    open_time: '07:00', close_time: '21:00' },
    { day_of_week: 'tuesday',   open_time: '07:00', close_time: '21:00' },
    { day_of_week: 'wednesday', open_time: '07:00', close_time: '21:00' },
    { day_of_week: 'thursday',  open_time: '07:00', close_time: '21:00' },
    { day_of_week: 'friday',    open_time: '07:00', close_time: '20:00' },
    { day_of_week: 'saturday',  open_time: '08:00', close_time: '18:00' },
    { day_of_week: 'sunday',    open_time: '09:00', close_time: '15:00' },
];

const seedData = async () => {
    try {
        const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sportsplex';
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB for seeding...');

        const hashedPass = await bcrypt.hash('password123', 10);

        // Clear all existing data
        await User.deleteMany({});
        await SportFacility.deleteMany({});
        await FacilityOperatingSchedule.deleteMany({});
        await FacilityReview.deleteMany({});
        await Reservation.deleteMany({});
        console.log('Cleared existing data.');

        // ── Seed Facilities ──────────────────────────────────────────────────
        const facilities = await SportFacility.insertMany([
            {
                facility_name: 'Main Basketball Court',
                facility_type: 'Basketball',
                facility_description: 'Standard indoor basketball court with professional hardwood flooring.',
                facility_location: 'Building A, Ground Floor',
                facility_amenities: ['Locker Room', 'Shower', 'Bleachers', 'Scoreboard'],
                facility_surface: 'Hardwood',
                facility_size: 'Full Court (28m x 15m)',
                facility_image_url: '',
                facility_images: [],
                total_capacity: 30,
                total_bookable_slots: 2,
                hourly_rate_php: 600,
                min_booking_hours: 1,
                max_booking_hours: 3,
                advance_booking_days: 7,
                facility_status: 'available'
            },
            {
                facility_name: 'North Tennis Court',
                facility_type: 'Tennis',
                facility_description: 'Outdoor clay tennis court with floodlights for evening play.',
                facility_location: 'North Grounds',
                facility_amenities: ['Floodlights', 'Parking', 'Equipment Rental'],
                facility_surface: 'Clay',
                facility_size: 'Standard (23.77m x 10.97m)',
                facility_image_url: '',
                facility_images: [],
                total_capacity: 4,
                total_bookable_slots: 1,
                hourly_rate_php: 500,
                min_booking_hours: 1,
                max_booking_hours: 2,
                advance_booking_days: 7,
                facility_status: 'available'
            },
            {
                facility_name: 'Badminton Hall A',
                facility_type: 'Badminton',
                facility_description: 'Indoor badminton hall with 3 side-by-side courts and climate control.',
                facility_location: 'Building B, 2nd Floor',
                facility_amenities: ['Air Conditioning', 'Locker Room', 'Equipment Rental'],
                facility_surface: 'Synthetic Wood',
                facility_size: '3 Courts (13.4m x 6.1m each)',
                facility_image_url: '',
                facility_images: [],
                total_capacity: 12,
                total_bookable_slots: 3,
                hourly_rate_php: 400,
                min_booking_hours: 1,
                max_booking_hours: 3,
                advance_booking_days: 7,
                facility_status: 'available'
            },
            {
                facility_name: 'Pickleball Court A',
                facility_type: 'Pickleball',
                facility_description: 'Dedicated indoor pickleball court with professional-grade non-slip surface and net system.',
                facility_location: 'Building C, Ground Floor',
                facility_amenities: ['Paddle Rental', 'Air Conditioning', 'Water Fountains', 'Locker Room'],
                facility_surface: 'Non-Slip Acrylic',
                facility_size: 'Standard (13.4m x 6.1m)',
                facility_image_url: '',
                facility_images: [],
                total_capacity: 8,
                total_bookable_slots: 2,
                hourly_rate_php: 350,
                min_booking_hours: 1,
                max_booking_hours: 3,
                advance_booking_days: 7,
                facility_status: 'available'
            },
            {
                facility_name: 'Volleyball Hall',
                facility_type: 'Volleyball',
                facility_description: 'Full-size indoor volleyball hall with spring-cushioned flooring and retractable bleachers.',
                facility_location: 'Building A, 2nd Floor',
                facility_amenities: ['Bleachers', 'Scoreboard', 'Locker Room', 'Shower'],
                facility_surface: 'Spring-Cushioned Wood',
                facility_size: 'Standard (18m x 9m)',
                facility_image_url: '',
                facility_images: [],
                total_capacity: 24,
                total_bookable_slots: 1,
                hourly_rate_php: 500,
                min_booking_hours: 1,
                max_booking_hours: 3,
                advance_booking_days: 7,
                facility_status: 'available'
            },
            {
                facility_name: 'Futsal Court',
                facility_type: 'Futsal',
                facility_description: 'Multipurpose futsal court with professional artificial turf and full goal posts.',
                facility_location: 'South Grounds',
                facility_amenities: ['Floodlights', 'Parking', 'Ball Rental', 'Water Fountains'],
                facility_surface: 'Artificial Turf',
                facility_size: 'Standard (40m x 20m)',
                facility_image_url: '',
                facility_images: [],
                total_capacity: 20,
                total_bookable_slots: 1,
                hourly_rate_php: 700,
                min_booking_hours: 1,
                max_booking_hours: 4,
                advance_booking_days: 7,
                facility_status: 'available'
            },
            {
                facility_name: 'Table Tennis Room',
                facility_type: 'Table Tennis',
                facility_description: 'Climate-controlled room with 5 regulation table tennis tables and proper lighting.',
                facility_location: 'Building B, Ground Floor',
                facility_amenities: ['Air Conditioning', 'Paddle Rental', 'Good Lighting'],
                facility_surface: 'Sealed Concrete',
                facility_size: '5 Tables (2.74m x 1.525m each)',
                facility_image_url: '',
                facility_images: [],
                total_capacity: 20,
                total_bookable_slots: 5,
                hourly_rate_php: 200,
                min_booking_hours: 1,
                max_booking_hours: 3,
                advance_booking_days: 7,
                facility_status: 'available'
            },
        ]);
        console.log(`Seeded ${facilities.length} facilities.`);

        // ── Seed Operating Schedules (7 per facility) ────────────────────────
        const scheduleEntries = [];
        for (const facility of facilities) {
            for (const day of DEFAULT_WEEKLY_SCHEDULE) {
                scheduleEntries.push({
                    facility_id: facility._id,
                    ...day,
                    is_closed: false,
                    is_maintenance: false,
                    maintenance_note: ''
                });
            }
        }
        await FacilityOperatingSchedule.insertMany(scheduleEntries);
        console.log(`Seeded ${scheduleEntries.length} schedule entries (${DEFAULT_WEEKLY_SCHEDULE.length} days × ${facilities.length} facilities).`);

        // ── Seed Users ───────────────────────────────────────────────────────
        const users = await User.insertMany([
            {
                full_name: 'Raphael Maagma',
                email: 'raphael@sportsplex.com',
                password_hash: hashedPass,
                role: 'admin',
                avatar_url: 'https://i.pravatar.cc/150?u=raphael',
                bio: 'System Administrator',
                is_verified: true,
            },
            {
                full_name: 'Cris Jemuel',
                email: 'cris@sportsplex.com',
                password_hash: hashedPass,
                role: 'staff',
                avatar_url: 'https://i.pravatar.cc/150?u=cris',
                bio: 'Facility Coordinator',
                is_verified: true,
            },
            {
                full_name: 'LeBron James',
                email: 'lebron@sportsplex.com',
                password_hash: hashedPass,
                role: 'student',
                avatar_url: 'https://i.pravatar.cc/150?u=lebron',
                bio: 'Basketball GOAT',
                is_verified: true,
            },
            {
                full_name: 'Roger Federer',
                email: 'roger@sportsplex.com',
                password_hash: hashedPass,
                role: 'student',
                avatar_url: 'https://i.pravatar.cc/150?u=roger',
                bio: 'Tennis Maestro',
                is_verified: true,
            },
            {
                full_name: 'Lin Dan',
                email: 'lindan@sportsplex.com',
                password_hash: hashedPass,
                role: 'student',
                avatar_url: 'https://i.pravatar.cc/150?u=lindan',
                bio: 'Super Dan',
                is_verified: true,
            },
        ]);
        console.log(`Seeded ${users.length} users.`);

        // ── Seed Sample Reservation ──────────────────────────────────────────
        const lebronUser = users.find(u => u.email === 'lebron@sportsplex.com');
        const bballCourt = facilities.find(f => f.facility_name === 'Main Basketball Court');

        const sampleReservation = await Reservation.create({
            user: lebronUser._id,
            facility: bballCourt._id,
            seat_number: 1,
            date: new Date(),
            start_time: '14:00',
            end_time: '15:00',
            status: 'reserved'
        });
        console.log('Seeded sample reservation.');

        // ── Seed Sample Review ───────────────────────────────────────────────
        await FacilityReview.create({
            facility_id: bballCourt._id,
            reviewer_user_id: lebronUser._id,
            reservation_id: sampleReservation._id,
            rating_score: 5,
            review_title: 'Great court!',
            review_body: 'The hardwood floor is in excellent condition. Very clean and well maintained.',
            is_anonymous: false
        });
        console.log('Seeded sample review.');

        console.log('\n=== Demo Credentials (password: password123) ===');
        console.log('Admin       : raphael@sportsplex.com');
        console.log('Staff       : cris@sportsplex.com');
        console.log('Basketball  : lebron@sportsplex.com');
        console.log('Tennis      : roger@sportsplex.com');
        console.log('Badminton   : lindan@sportsplex.com');

        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error('Seeding failed:', err);
        await mongoose.disconnect();
        process.exit(1);
    }
};

seedData();
