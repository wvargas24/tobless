// controllers/userController.js

const User = require('../models/User');
const Membership = require('../models/Membership');
const logger = require('../config/logger');

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

module.exports = {
    subscribeToMembership,
};