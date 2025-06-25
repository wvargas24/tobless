const express = require('express');
const router = express.Router();

const {
  createBooking,
  getMyBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
  getAllBookings,
} = require('../controllers/booking.controller');

const { protect } = require('../middlewares/authMiddleware');
const { checkPermission } = require('../middlewares/permissionMiddleware');
const { PERMISSIONS } = require('../config/permissions');
const { check, validationResult } = require('express-validator');

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


// Ruta para crear una nueva reserva
router.route('/')
  // Obtener TODAS las reservas (protegido para el personal)
  .get(
    protect,
    checkPermission(PERMISSIONS.BOOKINGS_VIEW_ALL),
    getAllBookings
  )
  .post(
    protect,
    checkPermission(PERMISSIONS.BOOKINGS_CREATE),
    bookingValidationRules(),
    validate,
    createBooking
  );

// Ruta para obtener las reservas del usuario logueado
router.route('/mybookings')
  .get(protect, getMyBookings);

router.route('/:id')
  // Obtener una reserva por ID (protegido, la lógica de quién puede verla está en el controlador)
  .get(protect, getBookingById)
  // Actualizar una reserva (solo admin/manager)
  .put(
    protect,
    checkPermission(PERMISSIONS.BOOKINGS_MANAGE),
    updateBooking
  )
  // Eliminar una reserva (solo admin/manager)
  .delete(
    protect,
    checkPermission(PERMISSIONS.BOOKINGS_MANAGE),
    deleteBooking
  );

module.exports = router;
