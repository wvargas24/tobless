const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true
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
      default: ''
    },
    bio: {
      type: String,
      default: ''
    },
    isActive: {
      type: Boolean,
      default: true
    },
    membership: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Membership',
      required: false,
    },
    membershipStatus: {
      type: String,
      enum: ['active', 'expired', 'cancelled', 'pending'],
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