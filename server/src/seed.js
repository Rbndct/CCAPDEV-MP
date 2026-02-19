const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const seedUsers = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    // Sample Data
    const users = [
      {
        full_name: 'John Doe',
        email: 'john@example.com',
        password_hash: '$2b$10$EpIxNwllqgT61.y.W6.y.O1.y.W6.y.O1.y.W6.y.O1.y.W6.y.O', // Mock hash
        phone_number: '09171234567',
        role: 'user',
        avatar_url: 'https://i.pravatar.cc/150?u=john',
        bio: 'Avid basketball player.',
        primary_sport: 'Basketball',
        is_verified: true
      },
      {
        full_name: 'Jane Smith',
        email: 'jane@example.com',
        password_hash: '$2b$10$EpIxNwllqgT61.y.W6.y.O1.y.W6.y.O1.y.W6.y.O1.y.W6.y.O', // Mock hash
        phone_number: '09187654321',
        role: 'admin',
        avatar_url: 'https://i.pravatar.cc/150?u=jane',
        bio: 'Gym manager and tennis enthusiast.',
        primary_sport: 'Tennis',
        is_verified: true
      }
    ];

    // Clear existing users? Maybe check if they exist first.
    // For this task, we'll try to insert. If email unique constraint fails, we'll catch it.
    
    for (const user of users) {
      const exists = await User.findOne({ email: user.email });
      if (exists) {
        console.log(`User ${user.email} already exists. Skipping.`);
      } else {
        await User.create(user);
        console.log(`User ${user.email} created.`);
      }
    }

    console.log('Seeding completed.');
    await mongoose.disconnect();
    process.exit(0);

  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedUsers();
