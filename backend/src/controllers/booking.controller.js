const Booking = require('../models/Booking'); // Importar el modelo de reserva
const User = require('../models/User'); // Importar el modelo de usuario (para validación si es necesario)
const Membership = require('../models/Membership'); // Importar el modelo de membresía (para validación si es necesario)
const logger = require('../config/logger'); // Importar el logger

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
  try {
    const { user, membership, startDate, endDate } = req.body;

    // Basic validation (more robust validation is in routes)
    if (!user || !membership || !startDate || !endDate) {
      return res.status(400).json({ message: 'Please enter all fields (user, membership, startDate, endDate)' });
    }

    // Optional: Validate user and membership existence (could be done in middleware/validation)
    // const existingUser = await User.findById(user);
    // if (!existingUser) {
    //   return res.status(404).json({ message: 'User not found' });
    // }
    // const existingMembership = await Membership.findById(membership);
    // if (!existingMembership) {
    //   return res.status(404).json({ message: 'Membership not found' });
    // }

    // Optional: Check for overlapping bookings for the same user/resource (more complex logic)
    // const overlappingBooking = await Booking.findOne({
    //   user, // Or resource if you add resources later
    //   $or: [
    //     { startDate: { $lt: new Date(endDate) }, endDate: { $gt: new Date(startDate) } },
    //   ],
    // });
    // if (overlappingBooking) {
    //   return res.status(400).json({ message: 'Overlapping booking exists for this user/resource' });
    // }


    const booking = new Booking({
      user,
      membership,
      startDate,
      endDate,
    });

    const createdBooking = await booking.save();
    res.status(201).json(createdBooking);

  } catch (err) {
    logger.error('Error in createBooking:', err);
    res.status(500).send('Server error');
  }
};

// @desc    Get all bookings (or bookings for a specific user/membership)
// @route   GET /api/bookings
// @access  Private
const getBookings = async (req, res) => {
  try {
    // Example: Get bookings for the authenticated user
    const bookings = await Booking.find({ user: req.user.id }).populate('membership', 'name price'); // Populate membership details

    // Or get all bookings if admin role is added later and authorized
    // const bookings = await Booking.find({}).populate('user', 'name').populate('membership', 'name');

    res.json(bookings);
  } catch (err) {
    logger.error('Error in getBookings:', err);
    res.status(500).send('Server error');
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('membership', 'name price'); // Populate membership details

    // Optional: Check if the authenticated user is the owner of the booking (if not admin)
    if (booking && booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
         return res.status(403).json({ message: 'Not authorized to view this booking' });
    }


    if (booking) {
      res.json(booking);
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (err) {
    logger.error('Error in getBookingById:', err);
    res.status(500).send('Server error');
  }
};

// @desc    Update booking
// @route   PUT /api/bookings/:id
// @access  Private
const updateBooking = async (req, res) => {
  try {
    const { startDate, endDate, status } = req.body; // Allow updating dates or status
    const booking = await Booking.findById(req.params.id);

     // Optional: Check if the authenticated user is the owner of the booking (if not admin)
    if (booking && booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
         return res.status(403).json({ message: 'Not authorized to update this booking' });
    }


    if (booking) {
      booking.startDate = startDate || booking.startDate;
      booking.endDate = endDate || booking.endDate;
      booking.status = status || booking.status; // Allow updating status


      const updatedBooking = await booking.save();
      res.json(updatedBooking);
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (err) {
    logger.error('Error in updateBooking:', err);
    res.status(500).send('Server error');
  }
};

// @desc    Delete booking
// @route   DELETE /api/bookings/:id
// @access  Private
const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    // Optional: Check if the authenticated user is the owner of the booking (if not admin)
    if (booking && booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
         return res.status(403).json({ message: 'Not authorized to delete this booking' });
    }


    if (booking) {
      await booking.deleteOne(); // Usar deleteOne() o remove()
      res.json({ message: 'Booking removed' });
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (err) {
    logger.error('Error in deleteBooking:', err);
    res.status(500).send('Server error');
  }
};

module.exports = {
  createBooking,
  getBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
};
