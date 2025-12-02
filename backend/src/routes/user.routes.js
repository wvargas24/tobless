const express = require('express');
const router = express.Router();
// Importamos el controlador que maneja la lógica de suscripción
const { subscribeToMembership, getMyProfile, updateMyProfile, checkUsernameAvailability } = require('../controllers/user.controller');

// Importamos los middlewares que necesitamos
const { protect } = require('../middlewares/authMiddleware'); // Para asegurar que el usuario esté logueado
const { check, validationResult } = require('express-validator'); // Para validar los datos de entrada

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }
    const extractedErrors = [];
    errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }));

    return res.status(400).json({
        errors: extractedErrors,
    });
};

const subscriptionValidationRules = () => {
    return [
        // El campo 'membershipId' no debe estar vacío.
        check('membershipId', 'Membership ID is required').not().isEmpty(),
        // El campo 'membershipId' debe ser un ID válido de MongoDB.
        check('membershipId', 'Invalid Membership ID format').isMongoId(),
    ];
};

// @route   GET /api/users/check-username
// @desc    Verificar disponibilidad de username
// @access  Private
router.get('/check-username', protect, checkUsernameAvailability);

// @route   POST /api/users/subscribe
// @desc    Suscribe al usuario logueado a un plan de membresía
// @access  Private
router
    .route('/subscribe')
    .post(
        protect,                      // A. Primero, el middleware 'protect' asegura que el usuario esté autenticado.
        subscriptionValidationRules(),// B. Luego, se definen las reglas de validación para los datos que vienen en el body.
        validate,                     // C. El middleware 'validate' comprueba si hubo errores de validación.
        subscribeToMembership         // D. Si todo lo anterior pasa, se ejecuta el controlador final.
    );

router.route('/me')
    .get(protect, getMyProfile)
    .put(protect, updateMyProfile);

module.exports = router;
