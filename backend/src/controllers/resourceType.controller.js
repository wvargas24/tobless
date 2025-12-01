const ResourceType = require('../models/ResourceType');
const logger = require('../config/logger');

<<<<<<< HEAD
// @desc    Crear un nuevo tipo de recurso
const createResourceType = async (req, res, next) => {
    try {
        const resourceType = new ResourceType(req.body);
        const createdResourceType = await resourceType.save();
        res.status(201).json(createdResourceType);
    } catch (error) {
        next(error);
    }
};

// @desc    Obtener todos los tipos de recurso
const getResourceTypes = async (req, res, next) => {
    try {
        const resourceTypes = await ResourceType.find({});
        res.json(resourceTypes);
    } catch (error) {
        next(error);
    }
};

// @desc    Actualizar un tipo de recurso
const updateResourceType = async (req, res, next) => {
    try {
        const resourceType = await ResourceType.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!resourceType) {
            res.status(404); throw new Error('Tipo de recurso no encontrado');
        }
        res.json(resourceType);
    } catch (error) {
        next(error);
    }
};

// @desc    Eliminar un tipo de recurso
const deleteResourceType = async (req, res, next) => {
    try {
        const resourceType = await ResourceType.findById(req.params.id);
        if (!resourceType) {
            res.status(404); throw new Error('Tipo de recurso no encontrado');
        }
        // Aquí podrías añadir una lógica para verificar si algún recurso está usando este tipo antes de borrarlo.
        await resourceType.deleteOne();
        res.json({ message: 'Tipo de recurso eliminado' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createResourceType,
    getResourceTypes,
    updateResourceType,
    deleteResourceType,
};
=======
// @desc    Get all resource types
// @route   GET /api/resourcetypes
// @access  Public
const getResourceTypes = async (req, res) => {
  try {
    const resourceTypes = await ResourceType.find();
    res.status(200).json(resourceTypes);
  } catch (error) {
    logger.error('Error getting resource types:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a resource type
// @route   POST /api/resourcetypes
// @access  Private/Admin
const createResourceType = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Please add a name' });
    }

    const resourceTypeExists = await ResourceType.findOne({ name });

    if (resourceTypeExists) {
      return res.status(400).json({ message: 'Resource type already exists' });
    }

    const resourceType = await ResourceType.create({
      name,
      description,
    });

    res.status(201).json(resourceType);
  } catch (error) {
    logger.error('Error creating resource type:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update a resource type
// @route   PUT /api/resourcetypes/:id
// @access  Private/Admin
const updateResourceType = async (req, res) => {
  try {
    const resourceType = await ResourceType.findById(req.params.id);

    if (!resourceType) {
      return res.status(404).json({ message: 'Resource type not found' });
    }

    const updatedResourceType = await ResourceType.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedResourceType);
  } catch (error) {
    logger.error('Error updating resource type:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a resource type
// @route   DELETE /api/resourcetypes/:id
// @access  Private/Admin
const deleteResourceType = async (req, res) => {
  try {
    const resourceType = await ResourceType.findById(req.params.id);

    if (!resourceType) {
      return res.status(404).json({ message: 'Resource type not found' });
    }

    await resourceType.deleteOne();

    res.status(200).json({ id: req.params.id });
  } catch (error) {
    logger.error('Error deleting resource type:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getResourceTypes,
  createResourceType,
  updateResourceType,
  deleteResourceType,
};

>>>>>>> wvargas-frontend
