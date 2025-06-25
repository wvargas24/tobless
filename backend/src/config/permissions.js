// config/permissions.js (ejemplo)

const ROLES = {
    ADMIN: 'admin',
    MANAGER: 'manager',
    RECEPTIONIST: 'receptionist',
    BARISTA: 'barista',
    USER: 'user',
};

const PERMISSIONS = {
    // Aquí podríamos seguir añadiendo todos los permisos de la app
};

// Este es nuestro mapa de control de acceso
const ROLE_PERMISSIONS = new Map();
ROLE_PERMISSIONS.set(ROLES.ADMIN, ['users:create', 'users:view_all', 'memberships:assign', 'memberships:manage_types']);
ROLE_PERMISSIONS.set(ROLES.MANAGER, ['users:create', 'users:view_all', 'memberships:assign']);
ROLE_PERMISSIONS.set(ROLES.RECEPTIONIST, ['users:create', 'memberships:assign']);
ROLE_PERMISSIONS.set(ROLES.USER, ['bookings:create']); // Un usuario normal solo puede hacer reservas para sí mismo
// El barista por ahora no tiene permisos en la app
ROLE_PERMISSIONS.set(ROLES.BARISTA, []);


module.exports = {
    ROLES,
    ROLE_PERMISSIONS,
};