const Resource = require('../models/Resource');
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