const express = require('express');
const router = express.Router();

const { createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser } = require('../controllers/admin.controller');
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
router.route('/users')
    .post(
        protect,
        checkPermission(PERMISSIONS.USERS_CREATE_WITH_ROLE),
        createUserValidationRules(),
        validate,
        createUser
    )
    .get(
        protect,
        checkPermission('users:view_all'), // Usamos el string del permiso
        getAllUsers
    );

// Rutas para un usuario específico por ID
router.route('/users/:id')
    .get(
        protect,
        checkPermission('users:view_all'),
        getUserById
    )
    .put(
        protect,
        checkPermission(PERMISSIONS.USERS_EDIT),
        updateUser
    )
    .delete(
        protect,
        checkPermission(PERMISSIONS.USERS_DELETE),
        deleteUser
    );

module.exports = router;