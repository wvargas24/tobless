// config/permissions.js

const ROLES = {
    ADMIN: 'admin',
    MANAGER: 'manager',
    RECEPTIONIST: 'receptionist',
    BARISTA: 'barista',
    USER: 'user',
};

const PERMISSIONS = {
    USERS_CREATE_WITH_ROLE: 'users:create_with_role',
    MEMBERSHIPS_ASSIGN: 'memberships:assign',
    MEMBERSHIPS_MANAGE_TYPES: 'memberships:manage_types',
    BOOKINGS_CREATE: 'bookings:create',
    RESOURCES_MANAGE: 'resources:manage',
};

const ROLE_PERMISSIONS = new Map();

// Asignamos el nuevo permiso a admin y manager
ROLE_PERMISSIONS.set(ROLES.ADMIN, [
    PERMISSIONS.USERS_CREATE_WITH_ROLE,
    PERMISSIONS.MEMBERSHIPS_MANAGE_TYPES,
    PERMISSIONS.RESOURCES_MANAGE,
    'users:view_all',
    'memberships:assign',
]);
ROLE_PERMISSIONS.set(ROLES.MANAGER, [
    PERMISSIONS.RESOURCES_MANAGE,
    'users:create',
    'users:view_all',
    'memberships:assign'
]);
ROLE_PERMISSIONS.set(ROLES.RECEPTIONIST, ['users:create', 'memberships:assign']);
ROLE_PERMISSIONS.set(ROLES.USER, [PERMISSIONS.BOOKINGS_CREATE]);
ROLE_PERMISSIONS.set(ROLES.BARISTA, []);

module.exports = {
    ROLES,
    PERMISSIONS,
    ROLE_PERMISSIONS,
};