const Booking = require('../models/Booking');

/**
 * Calcula las horas usadas por un usuario en un mes específico para un tipo de recurso
 * @param {String} userId - ID del usuario
 * @param {String} resourceTypeId - ID del tipo de recurso
 * @param {Date} referenceDate - Fecha de referencia (default: hoy)
 * @returns {Number} Total de horas usadas
 */
const calculateHoursUsedThisMonth = async (userId, resourceTypeId, referenceDate = new Date()) => {
    const startOfMonth = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1);
    const endOfMonth = new Date(referenceDate.getFullYear(), referenceDate.getMonth() + 1, 0, 23, 59, 59);

    // Obtener todas las reservas del usuario este mes (no canceladas)
    const bookings = await Booking.find({
        user: userId,
        status: { $ne: 'cancelled' },
        startDate: {
            $gte: startOfMonth,
            $lte: endOfMonth
        }
    }).populate({
        path: 'resource',
        populate: { path: 'type' }
    });

    // Filtrar por tipo de recurso y sumar horas
    let totalHours = 0;

    for (const booking of bookings) {
        if (!booking.resource || !booking.resource.type) continue;

        // Verificar que el recurso sea del tipo correcto
        if (booking.resource.type._id.toString() === resourceTypeId.toString()) {
            const start = new Date(booking.startDate);
            const end = new Date(booking.endDate);
            const hours = (end - start) / (1000 * 60 * 60); // Diferencia en horas
            totalHours += hours;
        }
    }

    return Math.round(totalHours * 100) / 100; // Redondear a 2 decimales
};

/**
 * Calcula las horas usadas para todos los tipos de recursos en la membresía del usuario
 * @param {String} userId - ID del usuario
 * @param {Object} membership - Objeto de membresía con resourceLimits
 * @returns {Array} Array con uso por cada tipo de recurso
 */
const calculateAllResourceUsage = async (userId, membership) => {
    if (!membership.resourceLimits || membership.resourceLimits.length === 0) {
        return [];
    }

    const usagePromises = membership.resourceLimits.map(async (limit) => {
        const hoursUsed = await calculateHoursUsedThisMonth(userId, limit.resourceType._id || limit.resourceType);
        const available = limit.monthlyHourLimit === 0 ? 'Ilimitado' : limit.monthlyHourLimit - hoursUsed;
        const percentage = limit.monthlyHourLimit === 0 ? 0 : Math.round((hoursUsed / limit.monthlyHourLimit) * 100);

        return {
            resourceType: limit.resourceType,
            limit: limit.monthlyHourLimit,
            used: hoursUsed,
            available: available,
            percentage: percentage,
            isUnlimited: limit.monthlyHourLimit === 0
        };
    });

    return await Promise.all(usagePromises);
};

module.exports = {
    calculateHoursUsedThisMonth,
    calculateAllResourceUsage
};

