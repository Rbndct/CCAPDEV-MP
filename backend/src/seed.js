require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('./models/User');
const Facility = require('./models/Facility');
const Reservation = require('./models/Reservation');

const seedData = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sportsplex';
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    // Hash a common password for all demo accounts
    const hashedPass = await bcrypt.hash('password123', 10);

    // Clear all existing data
    await User.deleteMany({});
    await Facility.deleteMany({});
    await Reservation.deleteMany({});
    console.log('Cleared existing data.');

    // Seed Facilities
    const facilities = await Facility.insertMany([
      { name: 'Main Basketball Court', type: 'Basketball', capacity: 30, hourly_rate: 600, status: 'available', description: 'Standard indoor basketball court' },
      { name: 'North Tennis Court', type: 'Tennis', capacity: 4, hourly_rate: 500, status: 'available', description: 'Outdoor clay tennis court' },
      { name: 'Badminton Hall A', type: 'Badminton', capacity: 12, hourly_rate: 400, status: 'available', description: 'Indoor badminton hall with 3 courts' },
    ]);
    console.log(`Seeded ${facilities.length} facilities.`);

    // Seed Users
    const users = await User.insertMany([
      {
        full_name: 'Admin SportsPlex',
        email: 'admin@sportsplex.com',
        password_hash: hashedPass,
        role: 'admin',
        avatar_url: 'https://i.pravatar.cc/150?u=admin',
        bio: 'System Administrator',
        is_verified: true,
      },
      {
        full_name: 'Staff Member',
        email: 'staff@sportsplex.com',
        password_hash: hashedPass,
        role: 'staff',
        avatar_url: 'https://i.pravatar.cc/150?u=staff',
        bio: 'Facility Coordinator',
        is_verified: true,
      },
      {
        full_name: 'Student Athlete',
        email: 'student@sportsplex.com',
        password_hash: hashedPass,
        role: 'student',
        avatar_url: 'https://i.pravatar.cc/150?u=student',
        bio: 'Regular student',
        is_verified: true,
      },
    ]);
    console.log(`Seeded ${users.length} users.`);

    // Seed sample reservations for student athlete
    const studentUser = users.find(u => u.email === 'student@sportsplex.com');
    const bballCourt = facilities.find(f => f.name === 'Main Basketball Court');

    await Reservation.create({
      user: studentUser._id,
      facility: bballCourt._id,
      seat_number: 1,
      date: new Date(),
      start_time: '14:00',
      end_time: '15:00',
      status: 'reserved'
    });
    console.log('Seeded sample reservation.');

    console.log('\n=== Demo Credentials (password: password123) ===');
    console.log('Admin  : admin@sportsplex.com');
    console.log('Staff  : staff@sportsplex.com');
    console.log('Student: student@sportsplex.com');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedData();
