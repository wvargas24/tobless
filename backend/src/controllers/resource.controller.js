const Resource = require('../models/Resource');
<<<<<<< HEAD
const User = require('../models/User');
const logger = require('../config/logger');

// @desc    Crear un nuevo recurso
// @route   POST /api/resources
// @access  Private (Admin, Manager)
const createResource = async (req, res, next) => {
    try {
        const resource = new Resource(req.body);
        const createdResource = await resource.save();
        res.status(201).json(createdResource);
    } catch (error) {
        logger.error('Error creating resource:', error);
        next(error);
    }
};

// @desc    Obtener todos los recursos
// @route   GET /api/resources
// @access  Private (Cualquier usuario logueado)
const getAllResources = async (req, res, next) => {
    try {
        // Mostramos solo los recursos activos
        const resources = await Resource.find({ isActive: true })
            .populate('type', 'name'); // Poblamos el campo 'type' con el nombre del tipo de recurso
        res.json(resources);
    } catch (error) {
        logger.error('Error fetching resources:', error);
        next(error);
    }
};

// @desc    Actualizar un recurso
// @route   PUT /api/resources/:id
// @access  Private (Admin, Manager)
const updateResource = async (req, res, next) => {
    try {
        const resource = await Resource.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // Devuelve el documento modificado
            runValidators: true, // Corre las validaciones del schema
        });
        if (!resource) {
            res.status(404);
            throw new Error('Recurso no encontrado');
        }
        res.json(resource);
    } catch (error) {
        logger.error('Error updating resource:', error);
        next(error);
    }
};

// @desc    Eliminar un recurso
// @route   DELETE /api/resources/:id
// @access  Private (Admin, Manager)
const deleteResource = async (req, res, next) => {
    try {
        const resource = await Resource.findById(req.params.id);
        if (!resource) {
            res.status(404);
            throw new Error('Recurso no encontrado');
        }
        await resource.deleteOne();
        res.json({ message: 'Recurso eliminado correctamente' });
    } catch (error) {
        logger.error('Error deleting resource:', error);
        next(error);
    }
};

// @desc    Obtener solo los recursos que el usuario logueado puede reservar
// @route   GET /api/resources/bookable
// @access  Private
const getBookableResources = async (req, res, next) => {
    try {
        // 1. Obtenemos el usuario y su plan de membresía poblado
        const user = await User.findById(req.user.id).populate('membership');

        if (!user || user.membershipStatus !== 'active' || !user.membership) {
            // Si no tiene membresía activa, no puede reservar nada.
            return res.json([]);
        }

        // 2. Obtenemos la lista de IDs de los tipos de recurso permitidos por su membresía
        const allowedTypes = user.membership.allowedResourceTypes;

        // 3. Buscamos todos los recursos activos cuyo 'type' esté en la lista de permitidos
        const resources = await Resource.find({
            isActive: true,
            type: { $in: allowedTypes }
        }).populate('type', 'name');

        res.json(resources);
    } catch (error) {
        logger.error('Error fetching bookable resources:', error);
        next(error);
    }
};

module.exports = {
    createResource,
    getAllResources,
    updateResource,
    deleteResource,
    getBookableResources,
};
=======
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

>>>>>>> wvargas-frontend
