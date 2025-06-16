import express from 'express';
const router = express.Router();

import { check, validationResult } from 'express-validator';
import {
  createBooking,
  getBookings,
  getBookingById,
  updateBooking,
  deleteBooking
} from '../controllers/booking.controller.js';

import { // Usa import aquí
  protect
} from '../middlewares/authMiddleware.js';

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    });
  }
  next();
};

router.route('/')
  .post(
    protect,
    [
      check('user', 'User is required').notEmpty(),
      check('membership', 'Membership is required').notEmpty(),
      check('startDate', 'Start date is required and must be a valid date').isISO8601().toDate(),
      check('endDate', 'End date is required and must be a valid date').isISO8601().toDate(),
    ],
    handleValidationErrors,
    createBooking
  ) // Aplicar protect a la ruta POST
  .get(protect, getBookings);   // Aplicar protect a la ruta GET

router
  .route('/:id')
  .get(protect, getBookingById) // Aplicar protect a la ruta GET por ID
  .put(
    protect,
    [
      check('user', 'User must be a valid ID').optional().notEmpty(),
      check('membership', 'Membership must be a valid ID').optional().notEmpty(),
      check('startDate', 'Start date must be a valid date').optional().isISO8601().toDate(),
      check('endDate', 'End date must be a valid date').optional().isISO8601().toDate(),
    ],
    handleValidationErrors,
    updateBooking
  )   // Aplicar protect a la ruta PUT por ID
  .delete(protect, deleteBooking); // Aplicar protect a la ruta DELETE por ID

export default router; // Usa export default aquí
