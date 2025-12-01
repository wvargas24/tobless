const Resource = require('../models/Resource');
const logger = require('../config/logger');

// @desc    Get all resources
// @route   GET /api/resources
// @access  Public
const getResources = async (req, res) => {
  try {
    const resources = await Resource.find().populate('type', 'name');
    res.status(200).json(resources);
  } catch (error) {
    logger.error('Error getting resources:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get bookable resources
// @route   GET /api/resources/bookable
// @access  Public
const getBookableResources = async (req, res) => {
    try {
      const resources = await Resource.find({ isActive: true }).populate('type', 'name');
      res.status(200).json(resources);
    } catch (error) {
      logger.error('Error getting bookable resources:', error);
      res.status(500).json({ message: 'Server Error' });
    }
  };

// @desc    Create a resource
// @route   POST /api/resources
// @access  Private/Admin
const createResource = async (req, res) => {
  try {
    const { name, type, capacity, description, amenities, isActive } = req.body;

    if (!name || !type) {
      return res.status(400).json({ message: 'Please add name and type' });
    }

    const resource = await Resource.create({
      name,
      type,
      capacity,
      description,
      amenities,
      isActive
    });

    const populatedResource = await Resource.findById(resource._id).populate('type', 'name');

    res.status(201).json(populatedResource);
  } catch (error) {
    logger.error('Error creating resource:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update a resource
// @route   PUT /api/resources/:id
// @access  Private/Admin
const updateResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    const updatedResource = await Resource.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('type', 'name');

    res.status(200).json(updatedResource);
  } catch (error) {
    logger.error('Error updating resource:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a resource
// @route   DELETE /api/resources/:id
// @access  Private/Admin
const deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    await resource.deleteOne();

    res.status(200).json({ id: req.params.id });
  } catch (error) {
    logger.error('Error deleting resource:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getResources,
  getBookableResources,
  createResource,
  updateResource,
  deleteResource,
};

