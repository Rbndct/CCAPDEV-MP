const https = require('https');
const mongoose = require('mongoose');
require('dotenv').config();

const queries = {
  'Main Basketball Court': 'indoor-basketball-court',
  'North Tennis Court': 'tennis-court-empty',
  'Badminton Hall A': 'badminton-court-indoor',
  'Pickleball Court A': 'pickleball-court',
  'Volleyball Hall': 'indoor-volleyball-court',
  'Futsal Court': 'futsal-indoor-court',
  'Table Tennis Room': 'table-tennis-room'
};

async function fetchImages(query) {
  return new Promise((resolve, reject) => {
    const url = `https://unsplash.com/s/photos/${query}`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        // Regex to extract images.unsplash.com/photo-XXX
        const regex = /images\.unsplash\.com\/photo-[a-zA-Z0-9\-]+(\?q=80&w=1000&auto=format&fit=crop)?/g;
        const matches = data.match(regex);
        if (matches) {
          // Clean up and deduplicate
          const unique = [...new Set(matches.map(m => `https://${m.split('?')[0]}?q=80&w=1000&auto=format&fit=crop`))];
          resolve(unique.slice(0, 4));
        } else {
          resolve([]);
        }
      });
    }).on('error', reject);
  });
}

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  const SportFacility = require('./src/models/SportFacility');
  const facilities = await SportFacility.find();
  
  for (const fac of facilities) {
    const query = queries[fac.facility_name];
    if (query) {
      console.log(`Scraping 4 verified images for ${fac.facility_name} (${query})...`);
      const images = await fetchImages(query);
      if (images.length === 4) {
        fac.facility_images = images;
        await fac.save();
        console.log(`✅ Success for ${fac.facility_name}`);
      } else {
        console.log(`⚠️ Failed to find 4 images for ${fac.facility_name}, found ${images.length}`);
      }
    }
  }
  process.exit(0);
}

run();
