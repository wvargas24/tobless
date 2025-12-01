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

