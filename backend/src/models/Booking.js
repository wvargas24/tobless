// models/Booking.js

const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User', // Quién hizo la reserva
  },
  resource: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Resource', // Qué se reservó
  },
  membership: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Membership', // Con qué membresía se hizo la reserva (para historial)
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['confirmada', 'cancelada'],
    default: 'confirmada',
  },
  notes: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

// Índice para prevenir eficientemente la doble reserva del mismo recurso a la misma hora
bookingSchema.index({ resource: 1, startTime: 1, endTime: 1 });

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;