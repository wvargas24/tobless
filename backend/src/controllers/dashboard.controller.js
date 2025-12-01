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

        // Determinar la fecha objetivo (hoy o la fecha enviada por query param)
        let targetDate = new Date();
        if (req.query.date) {
            const parsedDate = new Date(req.query.date);
            if (!isNaN(parsedDate.getTime())) {
                targetDate = parsedDate;
            }
        }

        // Configurar inicio y fin del día objetivo
        const dayStart = new Date(targetDate);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(targetDate);
        dayEnd.setHours(23, 59, 59, 999);

        if (['admin', 'manager'].includes(user.role)) {
            // --- ADMIN/MANAGER STATS ---

            // 1. Total Active Users (Global stat, not date dependent)
            stats.totalUsers = await User.countDocuments({ isActive: true, role: 'user' });

            // 2. Active Bookings (Future from now, global stat)
            stats.activeBookings = await Booking.countDocuments({
                status: 'confirmed',
                startDate: { $gte: new Date() } 
            });

            // 3. Target Date Bookings count
            stats.todayBookingsCount = await Booking.countDocuments({
                status: 'confirmed',
                startDate: { $gte: dayStart, $lte: dayEnd }
            });

            // 4. Detailed Target Date Bookings (for the agenda list)
            stats.todayBookingsList = await Booking.find({
                status: 'confirmed',
                startDate: { $gte: dayStart, $lte: dayEnd }
            })
            .populate('user', 'name')
            .populate('resource', 'name')
            .sort({ startDate: 1 }); // List all events for the day, sorted by time

            // 5. Currently Occupied Resources (Real-time, ignores target date unless we want 'occupied at target date time' which is complex)
            // Let's keep this as "Right Now" status for the dashboard KPI card
            const now = new Date();
            stats.occupiedResourcesCount = await Booking.countDocuments({
                status: 'confirmed',
                startDate: { $lte: now },
                endDate: { $gte: now }
            });

        } else {
            // --- USER STATS ---

            // 1. Membership Status
            stats.membershipStatus = {
                status: user.membershipStatus, 
                endDate: user.membershipEndDate,
                planName: user.membership ? user.membership.name : 'Sin Plan' 
            };
            
            const fullUser = await User.findById(user._id).populate('membership', 'name');
            if (fullUser.membership) {
                 stats.membershipStatus.planName = fullUser.membership.name;
            }

            // 2. My Next Booking (Global logic: next upcoming booking from NOW)
            // But if a date is selected in agenda, maybe show bookings for THAT date?
            // For the main dashboard cards, we want "Next Upcoming".
            // For the agenda sidebar, we might want "Bookings on Selected Date".
            
            // Let's return both or handle logic. 
            // 'myNextBooking' will remain "next form now".
            const nextBooking = await Booking.findOne({
                user: user._id,
                status: 'confirmed',
                startDate: { $gte: new Date() }
            })
            .populate('resource', 'name')
            .sort({ startDate: 1 });

            stats.myNextBooking = nextBooking;

            // New: Bookings for the specific target date (for agenda sidebar)
            stats.myBookingsOnDate = await Booking.find({
                user: user._id,
                status: 'confirmed',
                startDate: { $gte: dayStart, $lte: dayEnd }
            })
            .populate('resource', 'name')
            .sort({ startDate: 1 });


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
