// controllers/booking.controller.js

const Booking = require('../models/Booking');
const Resource = require('../models/Resource');
const User = require('../models/User');
const Membership = require('../models/Membership');
const ResourceType = require('../models/ResourceType');
const logger = require('../config/logger');

// @desc    Crear una nueva reserva
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res, next) => {
  try {
    const { resourceId, startTime, endTime, notes } = req.body;
    const userId = req.user._id;

    // --- Inicio de las Validaciones de Negocio ---

    // 1. Obtener datos necesarios
    const user = await User.findById(userId);
    const resource = await Resource.findById(resourceId);
    if (!resource) {
      res.status(404); throw new Error('El recurso solicitado no existe');
    }
    const userMembershipPlan = await Membership.findById(user.membership);
    if (!userMembershipPlan) {
      res.status(400); throw new Error('No se encontró un plan de membresía asociado al usuario');
    }

    // 2. ¿La membresía del usuario está activa?
    if (user.membershipStatus !== 'active') {
      res.status(403); throw new Error('Tu membresía no está activa. No puedes realizar reservas.');
    }

    // 3. ¿La membresía permite reservar este TIPO de recurso?
    const allowedTypesAsString = userMembershipPlan.allowedResourceTypes.map(id => id.toString());

    if (!allowedTypesAsString.includes(resource.type.toString())) {
      // Obtenemos el nombre del tipo para el mensaje de error
      const resourceTypeDoc = await ResourceType.findById(resource.type);
      res.status(403);
      throw new Error(`Tu membresía no permite reservar recursos de tipo '${resourceTypeDoc.name}'`);
    }

    // 4. ¿El recurso ya está reservado en ese horario? (Prevención de doble reserva)
    const existingBooking = await Booking.findOne({
      resource: resourceId,
      status: 'confirmada', // Solo contamos las confirmadas
      $or: [ // Lógica para encontrar solapamientos de tiempo
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } },
      ],
    });

    if (existingBooking) {
      res.status(409); // 409 Conflict
      throw new Error('Este recurso ya está reservado para el horario seleccionado.');
    }

    // --- Fin de las Validaciones ---

    // Si todas las validaciones pasan, creamos la reserva
    const booking = await Booking.create({
      user: userId,
      resource: resourceId,
      membership: user.membership, // "Snapshot" de la membresía usada
      startTime,
      endTime,
      notes,
    });

    res.status(201).json(booking);

  } catch (error) {
    logger.error('Error creating booking:', error);
    next(error);
  }
};

// @desc    Obtener TODAS las reservas (para admin/staff)
// @route   GET /api/bookings
// @access  Private (Admin, Manager, Receptionist)
const getAllBookings = async (req, res, next) => {
  try {
    // En un futuro, aquí se podrían añadir filtros por fecha, usuario, etc.
    // Por ahora, obtenemos todas las reservas.
    const bookings = await Booking.find({})
      .populate('user', 'name email') // Traemos el nombre y email del usuario
      .populate({
        path: 'resource',
        populate: { path: 'type', select: 'name' }
      }) // y el nombre y tipo del recurso
      .sort({ startTime: -1 }); // Ordenamos por fecha de inicio, las más nuevas primero

    res.json(bookings);
  } catch (error) {
    logger.error('Error fetching all bookings:', error);
    next(error);
  }
};


// @desc    Obtener las reservas del usuario logueado
// @route   GET /api/bookings/mybookings
// @access  Private
const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate('resource', 'name type')
      .populate({
        path: 'resource',
        populate: { path: 'type', select: 'name' }
      });
    res.json(bookings);
  } catch (error) {
    next(error);
  }
};

// @desc    Obtener una reserva por su ID
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('user', 'name email').populate('resource');

    if (!booking) {
      res.status(404);
      throw new Error('Reserva no encontrada');
    }

    // Seguridad: Un usuario solo puede ver su propia reserva. Un admin/manager puede ver cualquiera.
    if (booking.user._id.toString() !== req.user.id && !['admin', 'manager'].includes(req.user.role)) {
      res.status(403);
      throw new Error('No autorizado para ver esta reserva');
    }

    res.json(booking);
  } catch (error) {
    next(error);
  }
};

// @desc    Actualizar una reserva
// @route   PUT /api/bookings/:id
// @access  Private (Admin, Manager)
const updateBooking = async (req, res, next) => {
  try {
    const { startTime, endTime, status, notes } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      res.status(404);
      throw new Error('Reserva no encontrada');
    }

    // Lógica de validación anti-solapamiento si las fechas cambian
    if (startTime || endTime) {
      const newStartTime = startTime || booking.startTime;
      const newEndTime = endTime || booking.endTime;

      const existingBooking = await Booking.findOne({
        resource: booking.resource,
        _id: { $ne: req.params.id }, // Excluir la reserva actual de la búsqueda
        status: 'confirmada',
        $or: [{ startTime: { $lt: newEndTime }, endTime: { $gt: newStartTime } }],
      });

      if (existingBooking) {
        res.status(409);
        throw new Error('El nuevo horario entra en conflicto con otra reserva existente.');
      }
    }

    // Actualizar los campos
    booking.startTime = startTime || booking.startTime;
    booking.endTime = endTime || booking.endTime;
    booking.status = status || booking.status;
    booking.notes = notes || booking.notes;

    const updatedBooking = await booking.save();
    res.json(updatedBooking);

  } catch (error) {
    next(error);
  }
};

// @desc    Eliminar una reserva (hard delete)
// @route   DELETE /api/bookings/:id
// @access  Private (Admin, Manager)
const deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      res.status(404);
      throw new Error('Reserva no encontrada');
    }

    await booking.deleteOne();
    res.json({ message: 'Reserva eliminada permanentemente' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
  getAllBookings,
};