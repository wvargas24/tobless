const Membership = require('../models/Membership'); // Importar el modelo de membresía
const User = require('../models/User');
const logger = require('../config/logger'); // Importar el logger
const { calculateAllResourceUsage } = require('../utils/bookingCalculations');


// @desc    Create new membership
// @route   POST /api/memberships
// @access  Private (Admin)
const createMembership = async (req, res) => {
  try {
    const { name, description, price, duration, amenities, allowedResourceTypes } = req.body;

    // Basic validation (more robust validation is in routes)
    if (!name || !price || !duration) {
      return res.status(400).json({ message: 'Please enter all required fields (name, price, duration)' });
    }

    const membership = new Membership({
      name,
      description,
      price,
      duration,
      amenities: amenities || [],
      allowedResourceTypes: allowedResourceTypes || []
    });

    const createdMembership = await membership.save();
    res.status(201).json(createdMembership);

  } catch (err) {
    logger.error('Error in createMembership:', err);
    res.status(500).send('Server error');
  }
};

// @desc    Get all memberships
// @route   GET /api/memberships
// @access  Private
const getMemberships = async (req, res) => {
  try {
    const memberships = await Membership.find({});
    res.json(memberships);
  } catch (err) {
    logger.error('Error in getMemberships:', err);
    res.status(500).send('Server error');
  }
};

// @desc    Get membership by ID
// @route   GET /api/memberships/:id
// @access  Private
const getMembershipById = async (req, res) => {
  try {
    const membership = await Membership.findById(req.params.id);

    if (membership) {
      res.json(membership);
    } else {
      res.status(404).json({ message: 'Membership not found' });
    }
  } catch (err) {
    logger.error('Error in getMembershipById:', err);
    res.status(500).send('Server error');
  }
};

// @desc    Update membership
// @route   PUT /api/memberships/:id
// @access  Private (Admin)
const updateMembership = async (req, res) => {
  try {
    const { name, description, price, duration, amenities, allowedResourceTypes } = req.body;
    const membership = await Membership.findById(req.params.id);

    if (membership) {
      membership.name = name || membership.name;
      membership.description = description || membership.description;
      membership.price = price || membership.price;
      membership.duration = duration || membership.duration;
      membership.allowedResourceTypes = allowedResourceTypes ?? membership.allowedResourceTypes;
      // Si se envía un array de amenidades, lo actualizamos
      if (amenities) {
        membership.amenities = amenities;
      }

      const updatedMembership = await membership.save();
      res.json(updatedMembership);
    } else {
      res.status(404).json({ message: 'Membership not found' });
    }
  } catch (err) {
    logger.error('Error in updateMembership:', err);
    res.status(500).send('Server error');
  }
};

// @desc    Delete membership
// @route   DELETE /api/memberships/:id
// @access  Private (Admin)
const deleteMembership = async (req, res) => {
  try {
    const membership = await Membership.findById(req.params.id);

    if (membership) {
      await membership.deleteOne(); // Usar deleteOne() o remove() dependiendo de la versión de Mongoose
      res.json({ message: 'Membership removed' });
    } else {
      res.status(404).json({ message: 'Membership not found' });
    }
  } catch (err) {
    logger.error('Error in deleteMembership:', err);
    res.status(500).send('Server error');
  }
};

// @desc    Get current user's membership with usage statistics
// @route   GET /api/memberships/my-membership
// @access  Private
const getMyMembership = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'membership',
      populate: { path: 'resourceLimits.resourceType' }
    });

    if (!user.membership) {
      return res.status(404).json({ 
        message: 'No tienes una membresía asignada',
        hasMembership: false
      });
    }

    // Calcular uso de horas por cada tipo de recurso
    const usage = await calculateAllResourceUsage(req.user._id, user.membership);

    // Preparar respuesta
    const response = {
      membership: {
        _id: user.membership._id,
        name: user.membership.name,
        description: user.membership.description,
        price: user.membership.price,
        duration: user.membership.duration,
        amenities: user.membership.amenities,
        resourceLimits: user.membership.resourceLimits
      },
      status: user.membershipStatus,
      startDate: user.membershipStartDate,
      endDate: user.membershipEndDate,
      usage: usage,
      hasMembership: true
    };

    res.json(response);
  } catch (err) {
    logger.error('Error in getMyMembership:', err);
    res.status(500).send('Server error');
  }
};

module.exports = {
  createMembership,
  getMemberships,
  getMembershipById,
  updateMembership,
  deleteMembership,
  getMyMembership,
};
