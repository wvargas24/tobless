const mongoose = require('mongoose');

const resourceSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a resource name'],
    trim: true
  },
  type: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Please select a resource type'],
    ref: 'ResourceType',
  },
  capacity: {
    type: Number,
    default: 1,
  },
  description: {
    type: String,
  },
  amenities: [{
    type: String
  }],
  isActive: {
    type: Boolean,
    default: true,
  }
}, {
  timestamps: true,
});

const Resource = mongoose.model('Resource', resourceSchema);

module.exports = Resource;

