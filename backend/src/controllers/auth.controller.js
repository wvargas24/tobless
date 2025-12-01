const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const logger = require('../config/logger');

const generateToken = (user) => {
  const payload = {
    sub: user.id,
    name: user.name,
    username: user.username,
    email: user.email,
    role: user.role,
    membershipStatus: user.membershipStatus,
    membershipEndDate: user.membershipEndDate,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register new user
const registerUser = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: 'Please enter all fields' });
    }

    let user = await User.findOne({ $or: [{ email }, { username }] });

    if (user) {
      return res.status(400).json({ message: 'User already exists (email or username)' });
    }

    user = new User({ name, username, email, password });
    await user.save();

    if (user) {
      res.status(201).json({
        token: generateToken(user),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }

  } catch (err) {
    logger.error('Error in registerUser:', err);
    res.status(500).send('Server error');
  }
};

// @desc    Auth user & get token
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
      if (user.membershipStatus === 'active' && user.membershipEndDate && user.membershipEndDate < new Date()) {
        console.log(`Membership for user ${user.username} has expired. Updating status.`);
        user.membershipStatus = 'expired';
        await user.save();
      }

      res.json({
        token: generateToken(user),
      });
    } else {
      res.status(400).json({ message: 'Invalid credentials' });
    }
  } catch (err) {
    logger.error('Error in loginUser:', err);
    res.status(500).send('Server error');
  }
};

// @desc    Check if username is available
// @route   GET /api/auth/check-username?username=XXXXX
// @access  Public
const checkUsernameAvailability = async (req, res) => {
  try {
    const { username } = req.query;

    if (!username) {
      return res.status(400).json({ message: 'Username parameter is required' });
    }

    const user = await User.findOne({ username });

    res.json({
      available: !user, // true if not found (available), false if found (taken)
      username: username
    });

  } catch (err) {
    logger.error('Error in checkUsernameAvailability:', err);
    res.status(500).send('Server error');
  }
};

module.exports = {
  registerUser,
  loginUser,
  checkUsernameAvailability
};
