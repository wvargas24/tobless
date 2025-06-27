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
    BOOKINGS_MANAGE: 'bookings:manage',
    BOOKINGS_VIEW_ALL: 'bookings:view_all',
    RESOURCES_MANAGE: 'resources:manage',
    USERS_EDIT: 'users:edit', // Para editar cualquier usuario
    USERS_DELETE: 'users:delete'
};

const ROLE_PERMISSIONS = new Map();

// Asignamos el nuevo permiso a admin y manager
ROLE_PERMISSIONS.set(ROLES.ADMIN, [
    PERMISSIONS.USERS_CREATE_WITH_ROLE,
    PERMISSIONS.MEMBERSHIPS_MANAGE_TYPES,
    PERMISSIONS.RESOURCES_MANAGE,
    PERMISSIONS.BOOKINGS_MANAGE,
    PERMISSIONS.BOOKINGS_VIEW_ALL,
    PERMISSIONS.BOOKINGS_CREATE,
    PERMISSIONS.USERS_EDIT,
    PERMISSIONS.USERS_DELETE,
    'users:view_all',
    'memberships:assign',
]);
ROLE_PERMISSIONS.set(ROLES.MANAGER, [
    PERMISSIONS.RESOURCES_MANAGE,
    PERMISSIONS.BOOKINGS_MANAGE,
    PERMISSIONS.BOOKINGS_VIEW_ALL,
    PERMISSIONS.BOOKINGS_CREATE,
    'users:create',
    'users:view_all',
    'memberships:assign'
]);
ROLE_PERMISSIONS.set(ROLES.RECEPTIONIST, [
    PERMISSIONS.BOOKINGS_VIEW_ALL,
    PERMISSIONS.BOOKINGS_CREATE,
    'users:create',
    'memberships:assign'
]);

ROLE_PERMISSIONS.set(ROLES.USER, [PERMISSIONS.BOOKINGS_CREATE]);
ROLE_PERMISSIONS.set(ROLES.BARISTA, []);

module.exports = {
    ROLES,
    PERMISSIONS,
    ROLE_PERMISSIONS,
};