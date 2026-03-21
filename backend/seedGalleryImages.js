require('dotenv').config();
const mongoose = require('mongoose');

// Connect using the cloud URI from .env
const MONGODB_URI = process.env.MONGODB_URI;

// The actual schema model used by the app
const SportFacility = require('./src/models/SportFacility');

// Hyper-realistic photos mapped to the exact facility names seeded in the DB
const exactFacilityImageMap = {
  'Main Basketball Court': [
    'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=1000&auto=format&fit=crop', // Massive indoor court overview
    'https://plus.unsplash.com/premium_photo-1664302152996-22441c2c8af6?q=80&w=1000&auto=format&fit=crop', // Professional hoop up close
    'https://images.unsplash.com/photo-1519861531473-920026073fdc?q=80&w=1000&auto=format&fit=crop', // Spalding ball on wood floor
    'https://images.unsplash.com/photo-1627627256672-027a4613801d?q=80&w=1000&auto=format&fit=crop'  // Dramatic lighting
  ],
  'North Tennis Court': [
    'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=1000&auto=format&fit=crop', // Crisp outdoor hard court
    'https://images.unsplash.com/photo-1587280501635-6cb10cece9de?q=80&w=1000&auto=format&fit=crop', // Rackets and fresh balls
    'https://images.unsplash.com/photo-1599586120429-48281b6f0ece?q=80&w=1000&auto=format&fit=crop', // Net detail
    'https://images.unsplash.com/photo-1622279457486-dafc48bb4ee6?q=80&w=1000&auto=format&fit=crop'  // Action service
  ],
  'Badminton Hall A': [
    'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=1000&auto=format&fit=crop', // Green synthetic indoor hall
    'https://images.unsplash.com/photo-1611250282006-4484dd3fba6b?q=80&w=1000&auto=format&fit=crop', // Feather shuttlecocks stacked
    'https://images.unsplash.com/photo-1521537634581-0dced2fee2ef?q=80&w=1000&auto=format&fit=crop', // Indoor lighting detail
    'https://plus.unsplash.com/premium_photo-1664301524345-90a694774519?q=80&w=1000&auto=format&fit=crop' // Racket smash
  ],
  'Pickleball Court A': [
    // Pickleball specific realistic courts
    'https://images.unsplash.com/photo-1655760205269-eecfc14a6fb7?q=80&w=1000&auto=format&fit=crop', // Hard court lines
    'https://images.unsplash.com/photo-1678834954005-598d89e27c1a?q=80&w=1000&auto=format&fit=crop', // Paddles resting
    'https://images.unsplash.com/photo-1679089539265-f48bfdf66723?q=80&w=1000&auto=format&fit=crop', // Pickleball in net
    'https://images.unsplash.com/photo-1678834571477-cc4e0df7acaf?q=80&w=1000&auto=format&fit=crop'  // Players
  ],
  'Volleyball Hall': [
    'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?q=80&w=1000&auto=format&fit=crop', // Indoor wooden volleyball hall
    'https://images.unsplash.com/photo-1592544778107-16d419d885ed?q=80&w=1000&auto=format&fit=crop', // Mikasa ball close up
    'https://images.unsplash.com/photo-1526624231804-032906ebb727?q=80&w=1000&auto=format&fit=crop', // Net action
    'https://images.unsplash.com/photo-1605333555901-7fa2c40c5f2d?q=80&w=1000&auto=format&fit=crop'  // Team huddle
  ],
  'Futsal Court': [
    'https://images.unsplash.com/photo-1518605368461-1ee1153bb060?q=80&w=1000&auto=format&fit=crop', // Indoor synthetic turf pitch
    'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1000&auto=format&fit=crop', // Futsal ball on green
    'https://images.unsplash.com/photo-1552667466-07770ae110d0?q=80&w=1000&auto=format&fit=crop', // Goal net
    'https://images.unsplash.com/photo-1535136015758-16e6d1cdebf6?q=80&w=1000&auto=format&fit=crop'  // Action shot inside hall
  ],
  'Table Tennis Room': [
    'https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?q=80&w=1000&auto=format&fit=crop', // Professional Stiga table inside room
    'https://images.unsplash.com/photo-1534158914592-06132ccb1e29?q=80&w=1000&auto=format&fit=crop', // Paddles and orange balls
    'https://images.unsplash.com/photo-1584859591461-e1f13d8032aa?q=80&w=1000&auto=format&fit=crop', // Net macro
    'https://images.unsplash.com/photo-1611099619183-b9dfce88cf98?q=80&w=1000&auto=format&fit=crop'  // Overhead room shot
  ]
};

async function seedImages() {
  try {
    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI is not set in .env!");
    }
    
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB Atlas.');

    const facilities = await SportFacility.find();
    let updatedCount = 0;

    for (const facility of facilities) {
      const name = facility.facility_name;
      const imagesToSeed = exactFacilityImageMap[name];
      
      if (imagesToSeed) {
        facility.facility_images = imagesToSeed;
        await facility.save();
        updatedCount++;
        console.log(`✅ Seeded 4 hyper-realistic photos for: ${name}`);
      } else {
        console.log(`⚠️ No exact map found for: ${name}`);
      }
    }

    console.log(`\nSuccess! Updated ${updatedCount} facilities with highly detailed realistic photos.`);
    process.exit(0);
  } catch (err) {
    console.error('Error seeding images:', err);
    process.exit(1);
  }
}

seedImages();
