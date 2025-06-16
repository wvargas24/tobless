import Membership from '../models/Membership.js';

// @desc    Create a new membership
// @route   POST /api/memberships
// @access  Private (Admin)
const createMembership = async (req, res) => {
  try {
    const { name, description, price, duration } = req.body;

    // Basic validation
    if (!name || !price || !duration) {
      return res.status(400).json({
        message: 'Please enter all required fields (name, price, duration)'
      });
    }

    const membership = new Membership({
      name,
      description,
      price,
      duration,
    });

    const createdMembership = await membership.save();
    res.status(201).json(createdMembership);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Get all memberships
// @route   GET /api/memberships
// @access  Public
const getMemberships = async (req, res) => {
  try {
    const memberships = await Membership.find({});
    res.json(memberships);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Get single membership by ID
// @route   GET /api/memberships/:id
// @access  Public
const getMembershipById = async (req, res) => {
  try {
    const membership = await Membership.findById(req.params.id);

    if (membership) {
      res.json(membership);
    } else {
      res.status(404).json({
        message: 'Membership not found'
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Update a membership
// @route   PUT /api/memberships/:id
// @access  Private (Admin)
const updateMembership = async (req, res) => {
  try {
    const { name, description, price, duration } = req.body;

    const membership = await Membership.findById(req.params.id);

    if (membership) {
      membership.name = name || membership.name;
      membership.description = description || membership.description;
      membership.price = price || membership.price;
      membership.duration = duration || membership.duration;

      const updatedMembership = await membership.save();
      res.json(updatedMembership);
    } else {
      res.status(404).json({
        message: 'Membership not found'
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Delete a membership
// @route   DELETE /api/memberships/:id
// @access  Private (Admin)
const deleteMembership = async (req, res) => {
  try {
    const membership = await Membership.findById(req.params.id);

    if (membership) {
      await membership.remove();
      res.json({
        message: 'Membership removed'
      });
    } else {
      res.status(404).json({
        message: 'Membership not found'
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

export {
  createMembership,
  getMemberships,
  getMembershipById,
  updateMembership,
  deleteMembership,
};