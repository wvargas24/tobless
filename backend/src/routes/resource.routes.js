const express = require('express');
const router = express.Router();
const {
  getResources,
  getBookableResources,
  createResource,
  updateResource,
  deleteResource,
} = require('../controllers/resource.controller');
const { protect } = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/authorizeRoles');

router.get('/bookable', getBookableResources);

router.route('/')
  .get(getResources)
  .post(protect, authorizeRoles('admin', 'manager'), createResource);

router.route('/:id')
  .put(protect, authorizeRoles('admin', 'manager'), updateResource)
  .delete(protect, authorizeRoles('admin', 'manager'), deleteResource);

module.exports = router;

