const express = require('express');
const router = express.Router();

const {
  createMembership,
  getMemberships,
  getMembershipById,
  updateMembership,
  deleteMembership,
} = require('../controllers/membership.controller');

const { protect } = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/authorizeRoles');

const { check, validationResult } = require('express-validator'); // Importar express-validator


// Validation middleware for membership creation and update
const membershipValidationRules = () => {
  return [
    check('name', 'Name is required').not().isEmpty().optional({ checkFalsy: true }), // Optional for update
    check('price', 'Price must be a number').isFloat().optional({ checkFalsy: true }), // Optional for update
    check('duration', 'Duration must be a number').isInt().optional({ checkFalsy: true }), // Optional for update
    // Add validation for required fields on create if needed (can be handled in controller or separate validation)
  ];
};

// Middleware to handle validation errors
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
  .post(protect, authorizeRoles('admin'), membershipValidationRules(), validate, createMembership) // Protected and admin-only
  .get(protect, getMemberships); // Protected

router
  .route('/:id')
  .get(protect, getMembershipById) // Protected
  .put(protect, authorizeRoles('admin'), membershipValidationRules(), validate, updateMembership) // Protected and admin-only
  .delete(protect, authorizeRoles('admin'), deleteMembership); // Protected and admin-only

module.exports = router;
