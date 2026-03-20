const mongoose = require('mongoose');
const Reservation = require('./models/Reservation');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://app_user:d0Y6CbboHrrX81w4@ccapdev-mp-cluster.lplsoas.mongodb.net/court_reservation?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
  .then(async () => {
    console.log('Connected to MongoDB');
    try {
        await mongoose.connection.collection('reservations').dropIndex('facility_1_seat_number_1_date_1_start_time_1');
        console.log('Dropped old strict unique index');
    } catch (err) {
        console.log('Old index not found or already dropped:', err.message);
    }
    
    console.log('Syncing mongoose indexes...');
    await Reservation.syncIndexes();
    console.log('Indexes synced successfully');
    process.exit(0);
  })
  .catch(err => {
      console.error(err);
      process.exit(1);
  });
