const express = require('express');
const router = express.Router();

const { createUser } = require('../controllers/admin.controller');
const { protect } = require('../middlewares/authMiddleware');
const { checkPermission } = require('../middlewares/permissionMiddleware');
const { PERMISSIONS } = require('../config/permissions');
const { check, validationResult } = require('express-validator');

// Middleware de validación
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) return next();
    return res.status(400).json({ errors: errors.array() });
};

// Reglas de validación para la creación de usuarios
const createUserValidationRules = () => {
    return [
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
        check('role', 'Role is required').not().isEmpty(),
    ];
};

// @route   POST /api/admin/users
router
    .route('/users')
    .post(
        protect,                                          // 1. Usuario logueado
        checkPermission(PERMISSIONS.USERS_CREATE_WITH_ROLE), // 2. Tiene el permiso específico
        createUserValidationRules(),                      // 3. Reglas de validación
        validate,                                         // 4. Ejecuta validación
        createUser                                        // 5. Ejecuta controlador
    );

module.exports = router;