const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  auth_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true
  },
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    default: 'https://i.ibb.co/1ftbcwZ7/man.png'
  },
  address: {
    street: String,
    ward: String,
    district: String,
    province: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
