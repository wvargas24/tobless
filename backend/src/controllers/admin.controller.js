const User = require('../models/User');
const logger = require('../config/logger');
const { ROLES } = require('../config/permissions');
const Membership = require('../models/Membership');

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

// @desc    Admin obtiene todos los usuarios
// @route   GET /api/admin/users
const getAllUsers = async (req, res, next) => {
    try {
        // 1. Creamos un objeto de filtro vacío
        const filter = {};

        // 2. Revisamos si nos llega un query param 'type'
        if (req.query.type === 'customer') {
            // Si piden clientes, filtramos por el rol 'user'
            filter.role = 'user';
        } else if (req.query.type === 'staff') {
            // Si piden personal, filtramos por todos los roles que NO son 'user'
            filter.role = { $ne: 'user' };
        }
        // Si no llega el query param 'type', el filtro queda vacío y trae a todos (comportamiento anterior)

        // 3. Aplicamos el filtro en la consulta
        const users = await User.find(filter).select('-password').populate('membership', 'name');
        res.json(users);
    } catch (error) {
        next(error);
    }
};

// @desc    Admin obtiene un usuario por su ID
// @route   GET /api/admin/users/:id
// @access  Private (Admin, Manager)
const getUserById = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select('-password').populate('membership');
        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }
        res.json(user);
    } catch (error) {
        next(error);
    }
};

// @desc    Admin actualiza cualquier usuario
// @route   PUT /api/admin/users/:id
const updateUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            // Un admin puede cambiar casi todo, incluyendo el rol y el estado
            user.name = req.body.name || user.name;
            user.role = req.body.role || user.role;
            user.isActive = req.body.isActive ?? user.isActive;
            user.email = req.body.email || user.email;
            user.phone = req.body.phone || user.phone;
            user.profilePictureUrl = req.body.profilePictureUrl || user.profilePictureUrl;
            user.bio = req.body.bio || user.bio;
            // Si se proporciona una nueva contraseña, se actualizará (el pre-save hook se encargará del hash)
            if (req.body.password) {
                user.password = req.body.password;
            }
            // Usamos 'req.body.membership' en lugar de 'membershipId'
            if (req.body.membership && user.membership?.toString() !== req.body.membership) {
                const membershipPlan = await Membership.findById(req.body.membership);
                if (!membershipPlan) {
                    res.status(404);
                    throw new Error('El plan de membresía a asignar no fue encontrado');
                }

                const currentDate = new Date();
                const endDate = new Date();
                endDate.setDate(currentDate.getDate() + membershipPlan.duration);

                // Asignamos todos los datos de la nueva membresía
                user.membership = req.body.membership;
                user.membershipStatus = 'active';
                user.membershipStartDate = currentDate;
                user.membershipEndDate = endDate;

            } else if (req.body.membership === null || req.body.membership === '') {
                // Si el admin quiere quitar la membresía
                user.membership = undefined;
                user.membershipStatus = null;
                user.membershipStartDate = undefined;
                user.membershipEndDate = undefined;
            }

            const updatedUser = await user.save();
            res.json(updatedUser);
        } else {
            res.status(404); throw new Error('User not found');
        }
    } catch (error) { next(error); }
};

// @desc    Admin desactiva (soft delete) un usuario
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            // En lugar de borrar, lo desactivamos (soft delete)
            user.isActive = false;
            await user.save();
            res.json({ message: 'User has been deactivated' });
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        next(error);
    }
};


module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
};