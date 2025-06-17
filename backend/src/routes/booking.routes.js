const express = require('express');
const router = express.Router();

const {
  createBooking,
  getBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
} = require('../controllers/booking.controller');

const { protect } = require('../middlewares/authMiddleware');
// No necesitamos authorizeRoles aquí a menos que quieras restringir el acceso a reservas a roles específicos


const { check, validationResult } = require('express-validator'); // Importar express-validator

// Validation middleware for booking creation and update
const bookingValidationRules = () => {
  return [
    check('user', 'User ID is required').not().isEmpty().optional({ checkFalsy: true }),
    check('membership', 'Membership ID is required').not().isEmpty().optional({ checkFalsy: true }),
    check('startDate', 'Start date is required and must be a valid date').isISO8601().toDate().optional({ checkFalsy: true }),
    check('endDate', 'End date is required and must be a valid date').isISO8601().toDate().optional({ checkFalsy: true }),
    check('status', 'Status must be one of active, cancelled, or completed').isIn(['active', 'cancelled', 'completed']).optional({ checkFalsy: true }),
  ];
};

// Middleware to handle validation errors (Assuming you are using the same validate function as in membership routes)
// You might want to centralize this or copy the function here if needed.
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }));

  return res.status(400).json({
    errors: extractedErrors,
  });
};


router.route('/')
  .post(protect, bookingValidationRules(), validate, createBooking) // Protected
  .get(protect, getBookings); // Protected

router
  .route('/:id')
  .get(protect, getBookingById) // Protected
  .put(protect, bookingValidationRules(), validate, updateBooking) // Protected
  .delete(protect, deleteBooking); // Protected

module.exports = router;
