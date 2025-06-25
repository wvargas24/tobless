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
    BOOKINGS_CREATE: 'bookings:create'
};

const ROLE_PERMISSIONS = new Map();

ROLE_PERMISSIONS.set(ROLES.ADMIN, [
    PERMISSIONS.USERS_CREATE_WITH_ROLE,
    'users:view_all',
    'memberships:assign',
    'memberships:manage_types'
]);
ROLE_PERMISSIONS.set(ROLES.MANAGER, ['users:create', 'users:view_all', 'memberships:assign']);
ROLE_PERMISSIONS.set(ROLES.RECEPTIONIST, ['users:create', 'memberships:assign']);
ROLE_PERMISSIONS.set(ROLES.USER, [PERMISSIONS.BOOKINGS_CREATE]);
ROLE_PERMISSIONS.set(ROLES.BARISTA, []);


module.exports = {
    ROLES,
    PERMISSIONS,
    ROLE_PERMISSIONS,
};