const Booking = require('../models/Booking');
const Resource = require('../models/Resource');
const logger = require('../config/logger');

// Helper to check availability
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

// Helper to validate business hours (9 AM to 6 PM)
const validateBusinessHours = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const startHour = start.getHours();
  const endHour = end.getHours();
  const endMinutes = end.getMinutes();

  // Business hours: 9:00 to 18:00
  if (startHour < 9 || startHour >= 18) {
      return false;
  }
  
  // For end time, allow exactly 18:00 but not 18:01
  if (endHour < 9 || (endHour > 18) || (endHour === 18 && endMinutes > 0)) {
      return false;
  }
  
  // Optional: Check if it's weekend (0 = Sunday, 6 = Saturday)
  // const day = start.getDay();
  // if (day === 0 || day === 6) return false;

  return true;
};


// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
  try {
    const { resource, membership, startDate, endDate } = req.body;
    const user = req.user._id; // Get user from authenticated request

    if (!resource || !startDate || !endDate) {
      return res.status(400).json({ message: 'Please enter resource, startDate, and endDate' });
    }

    // Validate dates logic
    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({ message: 'End date must be after start date' });
    }
    
    // Validate business hours
    if (!validateBusinessHours(startDate, endDate)) {
        return res.status(400).json({ message: 'Bookings are only allowed between 9:00 AM and 6:00 PM' });
    }

    // Check if resource exists
    const resourceExists = await Resource.findById(resource);
    if (!resourceExists) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    // Check availability
    const isAvailable = await checkAvailability(resource, startDate, endDate);
    if (!isAvailable) {
      return res.status(400).json({ message: 'Resource is not available for the selected dates' });
    }

    const booking = new Booking({
      user,
      resource,
      membership, // Optional
      startDate,
      endDate,
    });

    const createdBooking = await booking.save();
    // Populate resource and membership details in response
    const populatedBooking = await Booking.findById(createdBooking._id)
        .populate('resource', 'name')
        .populate('membership', 'name');

    res.status(201).json(populatedBooking);

  } catch (err) {
    logger.error('Error in createBooking:', err);
    res.status(500).send('Server error');
  }
};

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private
const getBookings = async (req, res) => {
  try {
    let query = {};
    
    // Allow filtering by resource (e.g., for calendar availability)
    if (req.query.resource) {
        query.resource = req.query.resource;
    }

    // If not admin/manager, only show own bookings UNLESS checking availability for a resource (public/shared info)
    if (req.user.role !== 'admin' && req.user.role !== 'manager') {
        // Current implementation: User only sees OWN bookings.
        query.user = req.user._id;
    }

    // Override for admin/manager to see all (or filtered by resource)
    if (req.user.role === 'admin' || req.user.role === 'manager') {
        if (req.query.resource) {
             query.resource = req.query.resource;
             delete query.user; 
        } else {
            // If no resource filter, show all.
            delete query.user;
        }
    }

    const bookings = await Booking.find(query)
      .populate('user', 'name email')
      .populate('resource', 'name type')
      .populate('membership', 'name');

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
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email')
      .populate('resource', 'name type')
      .populate('membership', 'name');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Access control
    if (booking.user._id.toString() !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'manager') {
      return res.status(403).json({ message: 'Not authorized to view this booking' });
    }

    res.json(booking);
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
    const { startDate, endDate, status, resource } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Access control
    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'manager') {
      return res.status(403).json({ message: 'Not authorized to update this booking' });
    }
    
    // If dates or resource changed, check availability and business hours
    if ((startDate || endDate || resource) && (status !== 'cancelled')) {
        const newStart = startDate || booking.startDate;
        const newEnd = endDate || booking.endDate;
        const newResource = resource || booking.resource;
        
        // Validate business hours for update too
        if (!validateBusinessHours(newStart, newEnd)) {
            return res.status(400).json({ message: 'Bookings are only allowed between 9:00 AM and 6:00 PM' });
        }

        // If changing dates/resource, verify availability excluding current booking
        const isAvailable = await checkAvailability(newResource, newStart, newEnd, booking._id);
        if (!isAvailable) {
            return res.status(400).json({ message: 'Resource is not available for the updated dates' });
        }
    }

    booking.startDate = startDate || booking.startDate;
    booking.endDate = endDate || booking.endDate;
    booking.status = status || booking.status;
    if (resource) booking.resource = resource;

    const updatedBooking = await booking.save();
    res.json(updatedBooking);
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

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Access control
    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'manager') {
      return res.status(403).json({ message: 'Not authorized to delete this booking' });
    }

    await booking.deleteOne();
    res.json({ message: 'Booking removed' });
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
