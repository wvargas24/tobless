// Archivo completo: controllers/authController.js

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const logger = require('../config/logger');

const generateToken = (user) => {
  const payload = {
    sub: user.id,
    name: user.name,
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
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please enter all fields' });
    }

    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    user = new User({ name, email, password });
    await user.save(); // El rol por defecto 'user' se asignará aquí gracias al modelo

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
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      if (user.membershipStatus === 'active' && user.membershipEndDate < new Date()) {
        console.log(`Membership for user ${user.email} has expired. Updating status.`);
        user.membershipStatus = 'expired';
        await user.save(); // Guardamos el cambio en la BD
      }

      // Generamos el token con la información actualizada
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

module.exports = {
  registerUser,
  loginUser
};