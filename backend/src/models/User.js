const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'manager', 'receptionist', 'barista'],
      default: 'user',
    },
    phone: {
      type: String,
      default: ''
    },
    profilePictureUrl: {
      type: String,
      default: '' // Guardaremos la URL a una imagen, no el archivo en sí
    },
    bio: {
      type: String,
      default: ''
    },
    isActive: { // Para "soft delete" o desactivar usuarios
      type: Boolean,
      default: true
    },
    membership: {
      type: mongoose.Schema.Types.ObjectId, // Referencia al ID de un documento de Membership
      ref: 'Membership', // Le dice a Mongoose que este ID corresponde al modelo 'Membership'
      required: false, // No todos los usuarios tendrán una membresía al registrarse
    },
    membershipStatus: {
      type: String,
      enum: ['active', 'expired', 'cancelled', 'pending'], // Estados posibles
      default: null,
    },
    membershipStartDate: {
      type: Date,
    },
    membershipEndDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});


const User = mongoose.model('User', userSchema);

module.exports = User;