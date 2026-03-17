require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// Routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const reservationRoutes = require('./routes/reservations');
const profileRoutes = require('./routes/profiles');
const paymentRoutes = require('./routes/payments');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:5174', 'http://127.0.0.1:5174'],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sportsplex', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB (SportsPlex)'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Route Registration
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/payments', paymentRoutes);

// Shared/Utility Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    system: 'SportsPlex Backend',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

app.listen(PORT, () => {
  console.log(`SportsPlex Server running on port ${PORT}`);
});
