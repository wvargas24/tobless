const express = require('express');
const router = express.Router();

const { createResource, getAllResources, updateResource, deleteResource, getBookableResources } = require('../controllers/resource.controller');
const { protect } = require('../middlewares/authMiddleware');
const { checkPermission } = require('../middlewares/permissionMiddleware');
const { PERMISSIONS } = require('../config/permissions');
const { check, validationResult } = require('express-validator');

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) return next();
    return res.status(400).json({ errors: errors.array() });
};

const resourceValidationRules = () => [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('type', 'El tipo de recurso es obligatorio y debe ser un ID válido').isMongoId(),
];

router.route('/')
    .get(protect, getAllResources) // Cualquiera logueado puede ver los recursos
    .post(
        protect,
        checkPermission(PERMISSIONS.RESOURCES_MANAGE), // Solo admin/manager
        resourceValidationRules(),
        validate,
        createResource
    );

router.route('/bookable')
    .get(protect, getBookableResources);

router.route('/:id')
    .put(
        protect,
        checkPermission(PERMISSIONS.RESOURCES_MANAGE), // Solo admin/manager
        check('type', 'Invalid Resource Type ID').optional().isMongoId(),
        validate,
        updateResource
    )
    .delete(
        protect,
        checkPermission(PERMISSIONS.RESOURCES_MANAGE), // Solo admin/manager
        deleteResource
    );

module.exports = router;