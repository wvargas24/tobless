const mongoose = require('mongoose');

const membershipSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a membership name'],
    unique: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
  },
  duration: {
    type: Number, // Duration in days
    required: [true, 'Please add a duration in days'],
  },
  amenities: {
    type: [String],
    default: []
  },
  allowedResourceTypes: [{ // Es un array de referencias
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ResourceType',
  }],
}, {
  timestamps: true,
});

const Membership = mongoose.model('Membership', membershipSchema);

module.exports = Membership;
