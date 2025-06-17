const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  membership: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Membership',
  },
  startDate: {
    type: Date,
    required: [true, 'Please add a start date'],
  },
  endDate: {
    type: Date,
    required: [true, 'Please add an end date'],
  },
  status: {
    type: String,
    enum: ['active', 'cancelled', 'completed'], // Definimos estados permitidos
    default: 'active',
  },
}, {
  timestamps: true,
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
