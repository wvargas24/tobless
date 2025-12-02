const mongoose = require('mongoose');

const resourceTypeSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre del tipo de recurso es obligatorio.'],
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  // En el futuro, podríamos añadir un campo para un ícono, color, etc.
  // icon: { type: String, default: 'pi-box' }
}, {
  timestamps: true,
});

const ResourceType = mongoose.model('ResourceType', resourceTypeSchema);

module.exports = ResourceType;
