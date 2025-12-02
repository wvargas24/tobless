const User = require('../models/User');
const Membership = require('../models/Membership');
const logger = require('../config/logger');

// @desc    Staff (receptionist/manager) onboards a new user with a membership
// @route   POST /api/staff/onboard-user
// @access  Private (Requires 'memberships:assign' permission)
const onboardUser = async (req, res, next) => {
    try {
        const { name, email, password, membershipId } = req.body;

        // Validar que el plan de membresía exista
        const membershipPlan = await Membership.findById(membershipId);
        if (!membershipPlan) {
            res.status(404);
            throw new Error('Membership plan not found');
        }

        // Validar que el usuario no exista
        let existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400);
            throw new Error('User with this email already exists');
        }

        // Crear el nuevo usuario
        const newUser = new User({ name, email, password });

        // Asignar la membresía activa
        const currentDate = new Date();
        const endDate = new Date();
        endDate.setDate(currentDate.getDate() + membershipPlan.duration);

        newUser.membership = membershipId;
        newUser.membershipStatus = 'active';
        newUser.membershipStartDate = currentDate;
        newUser.membershipEndDate = endDate;

        const createdUser = await newUser.save();

        res.status(201).json({
            message: 'User successfully onboarded',
            user: {
                _id: createdUser.id,
                name: createdUser.name,
                email: createdUser.email,
                role: createdUser.role,
                membershipStatus: createdUser.membershipStatus,
            },
        });

    } catch (err) {
        logger.error('Error in onboardUser:', err);
        next(err); // Pasamos el error a nuestro errorHandler centralizado
    }
};

module.exports = {
    onboardUser,
};