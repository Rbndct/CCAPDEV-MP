const https = require('https');
const mongoose = require('mongoose');
require('dotenv').config();

const queries = {
  'Main Basketball Court': 'indoor basketball court',
  'North Tennis Court': 'tennis court empty',
  'Badminton Hall A': 'indoor badminton court',
  'Pickleball Court A': 'pickleball court',
  'Volleyball Hall': 'indoor volleyball gym',
  'Futsal Court': 'indoor futsal court',
  'Table Tennis Room': 'table tennis table'
};

async function fetchVerifiedWikiImages(query) {
  return new Promise((resolve) => {
    // MediaSearch actually loads things via API but we can just use the regular search page
    const url = `https://commons.wikimedia.org/w/index.php?search=${encodeURIComponent(query)}&title=Special:MediaSearch&go=Go&type=image`;
    
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        // Regex matches the high-quality thumbnails from Commons search
        // https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/XXX.jpg/800px-XXX.jpg
        const regex = /https:\/\/upload\.wikimedia\.org\/wikipedia\/commons\/thumb\/[a-f0-9]\/[a-f0-9]{2}\/[^\/]+(\.jpg|\.jpeg|\.png)/gi;
        const matches = data.match(regex) || [];
        
        let uniqueHqUrls = [...new Set(matches)].map(thumbUrl => {
           // To get original via thumb URL on wikipedia: 
           // From: https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Example.jpg/800px-Example.jpg
           // We just use the thumbnail as is, but we want it high res. The regex stops before /800px
           return thumbUrl.replace('/thumb', '') + '?width=1000'; // actually Wikipedia doesn't support ?width on original, so just returning thumbUrl but replacing /thumb doesn't always work if the filename isn't appended at end.
           // Actually, the regex already cleanly captured up to the .jpg! 
           // Oh wait, /thumb/a/b/File.jpg is missing the actual file name at the end if we remove thumb.
           // Let's just use the thumbnail URLs but request them highly scaled (they are usually rendered via CSS or srcset)
        });

        // Let Wikipedia's API do it better so we get the ACTUAL original URLs without regex parsing pain:
        const apiUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrlimit=10&piprop=original&format=json`;
        https.get(apiUrl, {headers: {'User-Agent': 'Mozilla/5.0'}}, (res2) => {
           let d2 = '';
           res2.on('data', c => d2 += c);
           res2.on('end', () => {
              try {
                const j = JSON.parse(d2);
                let imgs = Object.values(j.query.pages)
                  .map(p => p.original ? p.original.source : null)
                  .filter(url => url && url.match(/\.(jpg|jpeg|png)$/i));
                
                // Shuffle to avoid paintings/weird first results
                imgs = imgs.filter(url => !url.toLowerCase().includes('oath') && !url.toLowerCase().includes('diagram') && !url.toLowerCase().includes('logo'));
                resolve(imgs.slice(0, 4));
              } catch (e) { resolve([]); }
           })
        });
      });
    });
  });
}

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to Atlas.');
  const SportFacility = require('./src/models/SportFacility');
  const facilities = await SportFacility.find();
  
  for (const fac of facilities) {
    const q = queries[fac.facility_name] || fac.facility_type;
    console.log(`Searching wiki for: ${q}`);
    const images = await fetchVerifiedWikiImages(q);
    
    if (images.length >= 4) {
      fac.facility_images = images;
      await fac.save();
      console.log(`✅ Fixed exactly 4 Wiki photos for ${fac.facility_name}`);
    } else {
      console.log(`⚠️ Not enough images: ${images.length} for ${fac.facility_name}`);
    }
  }
  process.exit();
}
run();
