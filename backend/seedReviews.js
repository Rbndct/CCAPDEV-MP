const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const User = require('./src/models/User');
const SportFacility = require('./src/models/SportFacility');
const FacilityReview = require('./src/models/FacilityReview');

const positiveReviews = [
  { title: 'Great Facility!', body: 'The court was clean, well-maintained, and the lighting was perfect for evening games.', score: 5 },
  { title: 'Solid experience', body: 'Had a good time here. Floor had good grip. Will definitely come back.', score: 4 },
  { title: 'Top notch', body: 'Probably one of the best courts in the area. Highly recommend!', score: 5 },
  { title: 'Good value for money', body: 'Affordable and decent quality. Not too crowded either.', score: 4 },
  { title: 'Excellent amenities', body: 'The locker rooms are clean and the staff is very accommodating.', score: 5 }
];

const mixedReviews = [
  { title: 'Okay, but could be better', body: 'The court itself is fine, but the parking situation is a bit of a hassle.', score: 3 },
  { title: 'Decent setup', body: 'Good equipment, but it gets a bit too hot during the afternoon.', score: 3 },
  { title: 'Average court', body: 'It does the job for a casual game, but the nets could use a replacement.', score: 3 }
];

const negativeReviews = [
  { title: 'Needs maintenance', body: 'Floor was quite dusty and slippery. Needs a good cleaning.', score: 2 },
  { title: 'Poor lighting', body: 'Hard to play here at night. Several bulbs are burnt out.', score: 2 }
];

const allReviewTemplates = [...positiveReviews, ...positiveReviews, ...mixedReviews, ...negativeReviews];

function getRandomTemplate() {
  return allReviewTemplates[Math.floor(Math.random() * allReviewTemplates.length)];
}

function shuffle(array) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

async function seed() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/sportsplex';
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to DB');

    // Clear old reviews
    await FacilityReview.deleteMany({});
    console.log('Cleared existing reviews.');

    const facilities = await SportFacility.find();
    const users = await User.find();

    if (facilities.length === 0 || users.length === 0) {
      console.log('Error: Not enough facilities or users in the database to seed reviews.');
      process.exit(1);
    }

    let totalReviewsSeeded = 0;

    for (const facility of facilities) {
      // Pick random number of reviews between 5 and 10, or max users available
      const maxPossible = Math.min(10, users.length);
      if (maxPossible === 0) continue;
      
      const numReviews = Math.floor(Math.random() * (maxPossible - 5 + 1)) + 5;
      const selectedUsers = shuffle([...users]).slice(0, numReviews);

      for (const user of selectedUsers) {
        const template = getRandomTemplate();
        // Allow tiny variance in score sometimes
        let finalScore = template.score;
        if (Math.random() > 0.8 && finalScore < 5) finalScore += 1;
        if (Math.random() > 0.8 && finalScore > 1) finalScore -= 1;

        const isAnon = Math.random() > 0.8;

        const review = new FacilityReview({
          facility_id: facility._id,
          reviewer_user_id: user._id,
          rating_score: finalScore,
          review_title: template.title,
          review_body: template.body,
          is_anonymous: isAnon
        });

        await review.save();
        totalReviewsSeeded++;
      }
    }

    console.log(`Successfully seeded ${totalReviewsSeeded} reviews across ${facilities.length} facilities.`);
    mongoose.disconnect();
  } catch (err) {
    console.error('Seeding error:', err);
    mongoose.disconnect();
  }
}

seed();
