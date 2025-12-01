const mongoose = require('mongoose');

const resourceTypeSchema = mongoose.Schema({
<<<<<<< HEAD
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
=======
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
>>>>>>> wvargas-frontend
});

const ResourceType = mongoose.model('ResourceType', resourceTypeSchema);

<<<<<<< HEAD
module.exports = ResourceType;
=======
module.exports = ResourceType;

>>>>>>> wvargas-frontend
