const User = require('../models/User');
const Booking = require('../models/Booking');
const Resource = require('../models/Resource');
const logger = require('../config/logger');

// @desc    Get dashboard stats based on user role
// @route   GET /api/dashboard
// @access  Private
const getDashboardStats = async (req, res, next) => {
    try {
        const user = req.user;
        const stats = {};

        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        if (['admin', 'manager'].includes(user.role)) {
            // --- ADMIN/MANAGER STATS ---

            // 1. Total Active Users
            stats.totalUsers = await User.countDocuments({ isActive: true, role: 'user' });

            // 2. Active Bookings (Today and Future)
            stats.activeBookings = await Booking.countDocuments({
                status: 'confirmed',
                startDate: { $gte: new Date() } // From now onwards
            });

            // 3. Today's Bookings count
            stats.todayBookingsCount = await Booking.countDocuments({
                status: 'confirmed',
                startDate: { $gte: todayStart, $lte: todayEnd }
            });

            // 4. Detailed Today's Bookings (for a quick list)
            stats.todayBookingsList = await Booking.find({
                status: 'confirmed',
                startDate: { $gte: todayStart, $lte: todayEnd }
            })
                .populate('user', 'name')
                .populate('resource', 'name')
                .sort({ startDate: 1 })
                .limit(5); // Show top 5 next events

            // 5. Currently Occupied Resources (Approximation based on time overlap with now)
            const now = new Date();
            stats.occupiedResourcesCount = await Booking.countDocuments({
                status: 'confirmed',
                startDate: { $lte: now },
                endDate: { $gte: now }
            });

        } else {
            // --- USER STATS ---

            // 1. Membership Status
            // Assuming the user object already has membership populated by the auth middleware or we fetch it lightly
            // If not, we might use: const fullUser = await User.findById(user._id).populate('membership');
            // But let's use what we have or keep it simple.
            stats.membershipStatus = {
                status: user.membershipStatus, // 'active', 'inactive'
                endDate: user.membershipEndDate,
                planName: user.membership ? user.membership.name : 'Sin Plan' // Note: requires population or separate query if not populated
            };

            // To ensure we have the plan name, let's quickly fetch if needed, or rely on frontend to know current user details.
            // Let's do a quick robust fetch for the user's specific dashboard needs.
            const fullUser = await User.findById(user._id).populate('membership', 'name');
            if (fullUser.membership) {
                stats.membershipStatus.planName = fullUser.membership.name;
            }

            // 2. My Next Booking
            const nextBooking = await Booking.findOne({
                user: user._id,
                status: 'confirmed',
                startDate: { $gte: new Date() }
            })
                .populate('resource', 'name')
                .sort({ startDate: 1 });

            stats.myNextBooking = nextBooking;

            // 3. My Active Bookings Count
            stats.myActiveBookingsCount = await Booking.countDocuments({
                user: user._id,
                status: { $in: ['confirmed', 'pending'] },
                startDate: { $gte: new Date() }
            });
        }

        res.json(stats);

    } catch (error) {
        logger.error('Error fetching dashboard stats:', error);
        next(error);
    }
};

module.exports = {
    getDashboardStats
};

