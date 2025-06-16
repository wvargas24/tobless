import Booking from '../models/Booking.js';
import User from '../models/User.js';
import Membership from '../models/Membership.js';

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private (requires authentication)
const createBooking = async (req, res) => {
  try {
    const {
      user,
      membership,
      startDate,
      endDate
    } = req.body;

    // Basic validation
    if (!user || !membership || !startDate || !endDate) {
      return res.status(400).json({
        message: 'Please enter all fields'
      });
    }

    // Validate user and membership existence
    const existingUser = await User.findById(user);
    if (!existingUser) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    const existingMembership = await Membership.findById(membership);
    if (!existingMembership) {
      return res.status(404).json({
        message: 'Membership not found'
      });
    }

    // Check for overlapping bookings for the same user
    const overlappingBooking = await Booking.findOne({
      user,
      $or: [{
        startDate: {
          $lt: new Date(endDate)
        },
        endDate: {
          $gt: new Date(startDate)
        }
      }, ],
    });

    if (overlappingBooking) {
      return res.status(400).json({
        message: 'User already has an overlapping booking'
      });
    }

    const booking = new Booking({
      user,
      membership,
      startDate,
      endDate,
    });

    const createdBooking = await booking.save();

    res.status(201).json(createdBooking);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private (requires authentication, possibly admin/manager role)
const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({}).populate('user', 'name email').populate('membership', 'name');
    res.json(bookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private (requires authentication, possibly owner or admin/manager)
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('user', 'name email').populate('membership', 'name');

    if (booking) {
      // Optional: Add logic to ensure only the owner or admin/manager can view
      // if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      //   return res.status(401).json({ message: 'Not authorized to view this booking' });
      // }
      res.json(booking);
    } else {
      res.status(404).json({
        message: 'Booking not found'
      });
    }

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Update booking
// @route   PUT /api/bookings/:id
// @access  Private (requires authentication, possibly owner or admin/manager)
const updateBooking = async (req, res) => {
  try {
    const {
      startDate,
      endDate,
      status
    } = req.body;

    const booking = await Booking.findById(req.params.id);

    if (booking) {
      // Optional: Add logic to ensure only the owner or admin/manager can update
      // if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      //   return res.status(401).json({ message: 'Not authorized to update this booking' });
      // }

      booking.startDate = startDate || booking.startDate;
      booking.endDate = endDate || booking.endDate;
      booking.status = status || booking.status;

      const updatedBooking = await booking.save();
      res.json(updatedBooking);
    } else {
      res.status(404).json({
        message: 'Booking not found'
      });
    }

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Delete booking
// @route   DELETE /api/bookings/:id
// @access  Private (requires authentication, possibly owner or admin/manager)
const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (booking) {
      // Optional: Add logic to ensure only the owner or admin/manager can delete
      // if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      //   return res.status(401).json({ message: 'Not authorized to delete this booking' });
      // }
      await booking.deleteOne();
      res.json({
        message: 'Booking removed'
      });
    } else {
      res.status(404).json({
        message: 'Booking not found'
      });
    }

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

export {
  createBooking,
  getBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
};