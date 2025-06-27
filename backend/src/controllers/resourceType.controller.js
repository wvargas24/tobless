const ResourceType = require('../models/ResourceType');
const logger = require('../config/logger');

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