const mongoose = require('mongoose');

const MembershipSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a membership name'],
    unique: true,
    trim: true,
    maxlength: [50, 'Name can not be more than 50 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description can not be more than 500 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price']
  },
  duration: {
    type: Number,
    required: [true, 'Please add a duration in days']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Membership', MembershipSchema);