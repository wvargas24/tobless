const express = require('express');
const router = express.Router();

const { onboardUser } = require('../controllers/staff.controller');
const { protect } = require('../middlewares/authMiddleware');
const { checkPermission } = require('../middlewares/permissionMiddleware');
const { check, validationResult } = require('express-validator');

// Middleware de validación (puedes ponerlo en un archivo separado si quieres)
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) return next();
    return res.status(400).json({ errors: errors.array() });
};

// Reglas de validación para el onboarding
const onboardingValidationRules = () => {
    return [
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
        check('membershipId', 'A valid Membership ID is required').isMongoId(),
    ];
};


// @route   POST /api/staff/onboard-user
router
    .route('/onboard-user')
    .post(
        protect,                      // 1. Asegura que el usuario esté logueado.
        checkPermission('memberships:assign'), // 2. Verifica que tenga el permiso específico.
        onboardingValidationRules(),  // 3. Define las reglas de validación.
        validate,                     // 4. Ejecuta la validación.
        onboardUser                   // 5. Si todo pasa, ejecuta el controlador.
    );

module.exports = router;