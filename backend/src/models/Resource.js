const mongoose = require('mongoose');

const resourceSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre del recurso es obligatorio.'],
        trim: true,
    },
    type: {
        type: String,
        required: true,
        enum: ['sala_reuniones', 'oficina_privada', 'escritorio_flexible', 'cabina_telefonica'],
        default: 'escritorio_flexible',
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