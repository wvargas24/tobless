const mongoose = require('mongoose');

const resourceTypeSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a resource type name'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
  }
}, {
  timestamps: true,
});

const ResourceType = mongoose.model('ResourceType', resourceTypeSchema);

module.exports = ResourceType;

