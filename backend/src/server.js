import dotenv from 'dotenv'; dotenv.config();
import express from 'express';
import cors from 'cors'; // Import the cors library
import connectDB from './config/db.js';
const { errorHandler } = require('/workspace/backend/src/middlewares/errorMiddleware');
import logger from '/workspace/backend/src/config/logger.js'; // Import the logger

import authRoutes from '/workspace/backend/src/routes/auth.routes.js';
import membershipRoutes from '/workspace/backend/src/routes/membership.routes.js';
import bookingRoutes from '/workspace/backend/src/routes/booking.routes.js';

const app = express(); // Initialize express app

// Connect Database
connectDB().then(() => {
  logger.info('MongoDB Connected...');
}).catch(err => {
  logger.error('MongoDB connection error:', err);
});

// Init Middleware
app.use(express.json({ extended: false }));

app.use(cors()); // Enable CORS for all origins
// Define Routes
app.get('/', (req, res) => res.send('API Running'));

// Use Auth Routes
app.use('/api/auth', authRoutes);

// Use Membership Routes
app.use('/api/memberships', membershipRoutes);

// Use Booking Routes
app.use('/api/bookings', bookingRoutes);

const PORT = process.env.PORT || 5000;

app.use(errorHandler);

app.listen(PORT, () => logger.info(`Server started on port ${PORT}`));

module.exports = app;
