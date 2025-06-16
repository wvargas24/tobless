const express = require('express');
const router = express.Router();

const { check, validationResult } = require('express-validator');
const {
  createMembership,
  getMemberships,
  getMembershipById,
  updateMembership,
  deleteMembership,
} = require('../controllers/membership.controller');

const {
  protect
} = require('../middlewares/authMiddleware');

const {
  authorizeRoles
} = require('../middlewares/authorizeRoles');

router.route('/')
  .post(
    protect,
    authorizeRoles('admin'),
    [
      check('name', 'Name is required').not().isEmpty(),
      check('price', 'Price is required and must be a number').not().isEmpty().isNumeric(),
      check('duration', 'Duration is required and must be a number').not().isEmpty().isNumeric(),
    ],
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    },
    createMembership
  ) // Protected route, Admin only
  .get(protect, getMemberships); // Protected route

router
  .route('/:id')
  .get(protect, getMembershipById) // Protected route
  .put(
    protect,
    authorizeRoles('admin'),
    updateMembership
  ) // Protected route, Admin only
  .delete(protect, authorizeRoles('admin'), deleteMembership); // Protected route, Admin only

module.exports = router;
