const https = require('https');

async function fetchUnsplashUrls(query) {
  return new Promise((resolve, reject) => {
    https.get(`https://api.pexels.com/v1/search?query=${query}&per_page=4`, {
      headers: {
        'Authorization': '563492ad6f917000010000018ebd2fccaef04fba8b45f4acac36312a', // Public public test key / community key if available, or I can just use Wikipedia
        'User-Agent': 'Mozilla/5.0'
      }
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
      res.on('error', reject);
    });
  });
}

fetchUnsplashUrls('badminton court').then(data => console.log(data));
