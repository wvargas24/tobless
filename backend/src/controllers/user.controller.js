// controllers/userController.js

const User = require('../models/User');
const Membership = require('../models/Membership');
const logger = require('../config/logger');

// @desc    Check if username is available
// @route   GET /api/users/check-username?username=...
// @access  Public (or Private depending on needs, let's make it Protected for now to avoid scraping)
const checkUsernameAvailability = async (req, res, next) => {
    try {
        const { username } = req.query;
        
        if (!username) {
            return res.status(400).json({ message: 'Username parameter is required' });
        }

        const user = await User.findOne({ username });
        
        if (user) {
            res.json({ available: false });
        } else {
            res.json({ available: true });
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Subscribe user to a membership
// @route   POST /api/users/subscribe
// @access  Private (el usuario debe estar logueado)
const subscribeToMembership = async (req, res) => {
    try {
        // El ID del plan al que se suscribe viene en el body
        const { membershipId } = req.body;
        // El ID del usuario logueado viene de nuestro middleware de autenticación (req.user.id)
        const userId = req.user.id;

        const membershipPlan = await Membership.findById(membershipId);
        if (!membershipPlan) {
            return res.status(404).json({ message: 'Membership plan not found' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const currentDate = new Date();
        const endDate = new Date();
        endDate.setDate(currentDate.getDate() + membershipPlan.duration);

        // Actualizamos los campos del usuario
        user.membership = membershipId;
        user.membershipStatus = 'active';
        user.membershipStartDate = currentDate;
        user.membershipEndDate = endDate;

        await user.save();

        // Devolvemos el usuario actualizado (sin la contraseña)
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            membership: user.membership,
            membershipStatus: user.membershipStatus,
            membershipEndDate: user.membershipEndDate,
        });

    } catch (err) {
        logger.error('Error in subscribeToMembership:', err);
        res.status(500).send('Server Error');
    }
};
// @desc    Obtener el perfil del usuario logueado
// @route   GET /api/users/me
const getMyProfile = async (req, res, next) => {
    try {
        // El middleware 'protect' ya nos da el usuario en req.user
        // Lo buscamos de nuevo para obtener la información más actualizada
        // y poblamos la información de su membresía.
        const user = await User.findById(req.user.id).select('-password').populate('membership');

        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        res.json(user);
    } catch (error) {
        next(error);
    }
};

// @desc    Actualizar el perfil del usuario logueado
// @route   PUT /api/users/me
const updateMyProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        if (user) {
            // Actualizamos solo los campos que el usuario puede cambiar
            user.name = req.body.name || user.name;
            // Prevent username update by user themselves if desired, or allow it.
            // Let's allow it but we should check availability if it changed. 
            // For simplicity here, assume front checks, or database will throw error on unique index.
            // user.username = req.body.username || user.username; 
            
            user.email = req.body.email || user.email; // Podrías querer validar si el nuevo email ya existe
            user.phone = req.body.phone ?? user.phone;
            user.bio = req.body.bio ?? user.bio;
            user.profilePictureUrl = req.body.profilePictureUrl ?? user.profilePictureUrl;

            // Si el usuario envía una nueva contraseña, la actualizamos
            if (req.body.password) {
                user.password = req.body.password; // El hook 'pre-save' se encargará de hashearla
            }

            const updatedUser = await user.save();

            // Devolvemos los datos actualizados (sin la contraseña)
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                username: updatedUser.username,
                email: updatedUser.email,
                role: updatedUser.role,
                phone: updatedUser.phone,
                bio: updatedUser.bio,
                profilePictureUrl: updatedUser.profilePictureUrl
            });
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        next(error);
    }
};

module.exports = {
    subscribeToMembership,
    getMyProfile,
    updateMyProfile,
    checkUsernameAvailability
};
