const express = require('express');
const router = express.Router();

const { registerUser, loginUser } = require('../controllers/auth.controller'); // Importar controladores

const { check, validationResult } = require('express-validator'); // Importar express-validator

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post(
  '/register',
  [ // Validation middleware
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  ],
  (req, res, next) => { // Validation error handling middleware
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next(); // Pass to the next middleware (controller)
  },
  registerUser // Controller function
);

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post(
  '/login',
  [ // Validation middleware
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  (req, res, next) => { // Validation error handling middleware
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next(); // Pass to the next middleware (controller)
  },
  loginUser // Controller function
);


module.exports = router;
