const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  artisan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  artisanName: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: [true, 'Product title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  audioStory: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Pottery & Terracotta',
      'Handloom & Textiles',
      'Woodcraft & Carvings',
      'Metalcraft & Dhokra',
      'Folk Art & Paintings',
      'Jewelry & Ornaments',
      'Bamboo & Jute',
      'Other Crafts'
    ]
  },
  stateOfOrigin: {
    type: String,
    required: true
  },
  materialsUsed: [{
    type: String
  }],
  dimensions: {
    type: String,
    default: ''
  },
  weight: {
    type: String,
    default: ''
  },
  stock: {
    type: Number,
    required: true,
    default: 1,
    min: 0
  },
  images: [{
    type: String,
    required: true
  }],
  isFeatured: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    default: 5.0
  },
  numReviews: {
    type: Number,
    default: 0
  },
  ecoFriendly: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
