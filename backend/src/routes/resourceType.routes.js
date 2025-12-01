<<<<<<< HEAD
// routes/resourceType.routes.js

const express = require('express');
const router = express.Router();

const { createResourceType, getResourceTypes, updateResourceType, deleteResourceType } = require('../controllers/resourceType.controller');
const { protect } = require('../middlewares/authMiddleware');
const { checkPermission } = require('../middlewares/permissionMiddleware');
const { PERMISSIONS } = require('../config/permissions');

// El permiso para gestionar tipos de recursos será el mismo que para gestionar recursos.
const managePermission = PERMISSIONS.RESOURCES_MANAGE;

router.route('/')
    .get(protect, getResourceTypes) // Cualquiera logueado puede ver los tipos
    .post(protect, checkPermission(managePermission), createResourceType);

router.route('/:id')
    .put(protect, checkPermission(managePermission), updateResourceType)
    .delete(protect, checkPermission(managePermission), deleteResourceType);

module.exports = router;
=======
const express = require('express');
const router = express.Router();
const {
  getResourceTypes,
  createResourceType,
  updateResourceType,
  deleteResourceType,
} = require('../controllers/resourceType.controller');
const { protect } = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/authorizeRoles');

router.route('/')
  .get(getResourceTypes)
  .post(protect, authorizeRoles('admin', 'manager'), createResourceType);

router.route('/:id')
  .put(protect, authorizeRoles('admin', 'manager'), updateResourceType)
  .delete(protect, authorizeRoles('admin', 'manager'), deleteResourceType);

module.exports = router;

>>>>>>> wvargas-frontend
