const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  },
  role: {
    type: String,
    enum: ['buyer', 'artisan', 'admin'],
    default: 'buyer'
  },
  phone: {
    type: String,
    default: ''
  },
  // Artisan specific fields
  craftSpecialty: {
    type: String,
    default: ''
  },
  stateOfOrigin: {
    type: String,
    default: 'Rajasthan'
  },
  district: {
    type: String,
    default: ''
  },
  village: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    default: ''
  },
  audioStoryUrl: {
    type: String,
    default: ''
  },
  avatar: {
    type: String,
    default: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150'
  },
  isVerified: {
    type: Boolean,
    default: true
  },
  rating: {
    type: Number,
    default: 4.8
  },
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpire: {
    type: Date
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
