const mongoose = require('mongoose');

const resourceSchema = mongoose.Schema({
<<<<<<< HEAD
    name: {
        type: String,
        required: [true, 'El nombre del recurso es obligatorio.'],
        trim: true,
    },
    type: {
        type: mongoose.Schema.Types.ObjectId, // Ahora es una referencia
        ref: 'ResourceType',                  // Apunta a nuestro nuevo modelo
        required: [true, 'El tipo de recurso es obligatorio.'],
    },
    capacity: {
        type: Number,
        required: true,
        default: 1,
    },
    description: {
        type: String,
        trim: true,
    },
    amenities: {
        type: [String], // Ej: ["Pizarra", "Proyector", "TV 50 pulgadas"]
        default: [],
    },
    isActive: {
        type: Boolean,
        default: true, // Para poder desactivar un recurso sin borrarlo (ej. por mantenimiento)
    },
}, {
    timestamps: true,
});

// Para evitar que se puedan crear múltiples recursos con el mismo nombre
resourceSchema.index({ name: 1 }, { unique: true });

const Resource = mongoose.model('Resource', resourceSchema);

module.exports = Resource;
=======
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

>>>>>>> wvargas-frontend
