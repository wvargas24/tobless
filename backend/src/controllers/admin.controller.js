const User = require('../models/User');
const logger = require('../config/logger');
const { ROLES } = require('../config/permissions');

// @desc    Admin creates a new user with a specific role
// @route   POST /api/admin/users
// @access  Private (Admin)
const createUser = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;

        // 1. Validar que el rol proporcionado sea válido
        if (!Object.values(ROLES).includes(role)) {
            res.status(400);
            throw new Error(`Invalid role specified. Valid roles are: ${Object.values(ROLES).join(', ')}`);
        }

        // 2. Validar que el usuario no exista
        const userExists = await User.findOne({ email });
        if (userExists) {
            res.status(400);
            throw new Error('User with this email already exists');
        }

        // 3. Crear el nuevo usuario, especificando el rol
        const user = await User.create({
            name,
            email,
            password,
            role, // Aquí asignamos el rol que viene en la petición
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            });
        } else {
            res.status(400);
            throw new Error('Invalid user data');
        }

    } catch (err) {
        logger.error('Error in admin.createUser:', err);
        next(err); // Pasamos el error a nuestro errorHandler
    }
};

module.exports = {
    createUser,
};