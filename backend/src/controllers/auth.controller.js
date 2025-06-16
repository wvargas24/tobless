import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Token expires in 30 days
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Please enter all fields'
      });
    }

    // Check for existing user
    let user = await User.findOne({
      email
    });

    if (user) {
      return res.status(400).json({
        message: 'User already exists'
      });
    }

    // Create user
    user = new User({
      name,
      email,
      password, // Password will be hashed by the pre-save hook in the model
    });

    await user.save();

    // If user is created successfully, generate token
    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({
        message: 'Invalid user data'
      });
    }

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const {
      email,
      password
    } = req.body;

    // Check for user email
    const user = await User.findOne({
      email
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({
        message: 'Invalid credentials'
      });
    }

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

export {
  registerUser,
  loginUser
};
