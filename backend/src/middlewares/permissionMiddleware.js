const { ROLE_PERMISSIONS } = require('../config/permissions');

const checkPermission = (requiredPermission) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const userRole = req.user.role;

        // 1. Obtenemos la lista de permisos para el rol del usuario desde nuestro mapa.
        const userPermissions = ROLE_PERMISSIONS.get(userRole);

        // 2. Verificamos si la lista de permisos del usuario incluye el permiso requerido por la ruta.
        if (userPermissions && userPermissions.includes(requiredPermission)) {
            // Si tiene el permiso, puede continuar.
            next();
        } else {
            // Si no tiene el permiso, le denegamos el acceso.
            res.status(403).json({
                message: `Forbidden: Your role (${userRole}) does not have the required permission ('${requiredPermission}') to access this route.`
            });
        }
    };
};

module.exports = { checkPermission };