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
  // Sistema de límites de horas por tipo de recurso
  resourceLimits: [{
    resourceType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ResourceType',
      required: true
    },
    monthlyHourLimit: {
      type: Number,
      required: true,
      default: 0  // 0 = sin límite (ilimitado)
    }
  }],
  // DEPRECATED: Mantenemos para compatibilidad pero usaremos resourceLimits
  allowedResourceTypes: [{ 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ResourceType',
  }],
}, {
  timestamps: true,
});

const Membership = mongoose.model('Membership', membershipSchema);

module.exports = Membership;
