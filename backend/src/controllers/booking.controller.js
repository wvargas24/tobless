const Booking = require('../models/Booking');
const Resource = require('../models/Resource');
const User = require('../models/User');
const logger = require('../config/logger');
// Corrected import for date-fns-tz
const { utcToZonedTime } = require('date-fns-tz');

const checkAvailability = async (resourceId, startDate, endDate, excludeBookingId = null) => {
  const query = {
    resource: resourceId,
    status: { $ne: 'cancelled' },
    $or: [
      { startDate: { $lt: new Date(endDate) }, endDate: { $gt: new Date(startDate) } },
    ],
  };

  if (excludeBookingId) {
    query._id = { $ne: excludeBookingId };
  }

  const existingBooking = await Booking.findOne(query);
  return !existingBooking;
};

const validateBusinessHours = (startDate, endDate) => {
  const timeZone = 'America/Caracas';
  const zonedStart = utcToZonedTime(new Date(startDate), timeZone);
  const zonedEnd = utcToZonedTime(new Date(endDate), timeZone);

  const startHour = zonedStart.getHours();
  const endHour = zonedEnd.getHours();
  const endMinutes = zonedEnd.getMinutes();

  if (startHour < 9 || startHour >= 18) {
    return false;
  }

  if (endHour < 9 || (endHour > 18) || (endHour === 18 && endMinutes > 0)) {
    return false;
  }

  return true;
};

const createBooking = async (req, res) => {
  try {
    const { resource, membership, startDate, endDate, userId } = req.body;
    let bookingUser = req.user._id;

    if (['admin', 'manager'].includes(req.user.role) && userId) {
      const targetUser = await User.findById(userId);
      if (!targetUser) {
        return res.status(404).json({ message: 'Usuario de destino no encontrado' });
      }
      bookingUser = userId;
    }

    if (!resource || !startDate || !endDate) {
      return res.status(400).json({ message: 'Por favor, ingrese recurso, fecha de inicio y fecha de fin' });
    }

    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({ message: 'La fecha de fin debe ser posterior a la fecha de inicio' });
    }

    if (!validateBusinessHours(startDate, endDate)) {
      return res.status(400).json({ message: 'Las reservas solo se permiten entre las 9:00 AM y las 6:00 PM' });
    }

    const resourceExists = await Resource.findById(resource);
    if (!resourceExists) {
      return res.status(404).json({ message: 'Recurso no encontrado' });
    }

    const isAvailable = await checkAvailability(resource, startDate, endDate);
    if (!isAvailable) {
      return res.status(400).json({ message: 'El recurso no está disponible para las fechas seleccionadas' });
    }

    const booking = new Booking({
      user: bookingUser,
      resource,
      membership,
      startDate,
      endDate,
    });

    const createdBooking = await booking.save();
    const populatedBooking = await Booking.findById(createdBooking._id)
      .populate('resource', 'name')
      .populate('membership', 'name');

    res.status(201).json(populatedBooking);

  } catch (err) {
    logger.error('Error en createBooking:', err);
    res.status(500).send('Error del servidor');
  }
};

const getAllBookings = async (req, res) => {
  try {
    let query = {};

    if (req.query.resource) {
      query.resource = req.query.resource;
    }

    if (req.user.role !== 'admin' && req.user.role !== 'manager') {
      query.user = req.user._id;
    }

    if (req.user.role === 'admin' || req.user.role === 'manager') {
      if (req.query.resource) {
        query.resource = req.query.resource;
        delete query.user;
      } else {
        delete query.user;
      }
    }

    const bookings = await Booking.find(query)
      .populate('user', 'name email')
      .populate('resource', 'name type')
      .populate('membership', 'name');

    res.json(bookings);
  } catch (err) {
    logger.error('Error en getAllBookings:', err);
    res.status(500).send('Error del servidor');
  }
};

const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('resource', 'name type')
      .populate('membership', 'name');
    res.json(bookings);
  } catch (err) {
    logger.error('Error en getMyBookings:', err);
    res.status(500).send('Error del servidor');
  }
};

const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email')
      .populate('resource', 'name type')
      .populate('membership', 'name');

    if (!booking) {
      return res.status(404).json({ message: 'Reserva no encontrada' });
    }

    if (booking.user._id.toString() !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'manager') {
      return res.status(403).json({ message: 'No autorizado para ver esta reserva' });
    }

    res.json(booking);
  } catch (err) {
    logger.error('Error en getBookingById:', err);
    res.status(500).send('Error del servidor');
  }
};

const updateBooking = async (req, res) => {
  try {
    const { startDate, endDate, status, resource } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Reserva no encontrada' });
    }

    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'manager') {
      return res.status(403).json({ message: 'No autorizado para actualizar esta reserva' });
    }

    if ((startDate || endDate || resource) && (status !== 'cancelled')) {
      const newStart = startDate || booking.startDate;
      const newEnd = endDate || booking.endDate;
      const newResource = resource || booking.resource;

      if (!validateBusinessHours(newStart, newEnd)) {
        return res.status(400).json({ message: 'Las reservas solo se permiten entre las 9:00 AM y las 6:00 PM' });
      }

      const isAvailable = await checkAvailability(newResource, newStart, newEnd, booking._id);
      if (!isAvailable) {
        return res.status(400).json({ message: 'El recurso no está disponible para las fechas actualizadas' });
      }
    }

    booking.startDate = startDate || booking.startDate;
    booking.endDate = endDate || booking.endDate;
    booking.status = status || booking.status;
    if (resource) booking.resource = resource;

    const updatedBooking = await booking.save();
    res.json(updatedBooking);
  } catch (err) {
    logger.error('Error en updateBooking:', err);
    res.status(500).send('Error del servidor');
  }
};

const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Reserva no encontrada' });
    }

    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'manager') {
      return res.status(403).json({ message: 'No autorizado para eliminar esta reserva' });
    }

    await booking.deleteOne();
    res.json({ message: 'Reserva eliminada' });
  } catch (err) {
    logger.error('Error en deleteBooking:', err);
    res.status(500).send('Error del servidor');
  }
};

const getBookingAvailability = async (req, res) => {
  try {
    const { resourceId } = req.params;
    const bookings = await Booking.find({
      resource: resourceId,
      status: { $ne: 'cancelled' }
    }).select('startDate endDate');

    res.json(bookings);
  } catch (err) {
    logger.error('Error en getBookingAvailability:', err);
    res.status(500).send('Error del servidor');
  }
};

module.exports = {
  createBooking,
  getAllBookings,
  getBookings: getAllBookings,
  getMyBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
  getBookingAvailability
};
