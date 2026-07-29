const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Review = require('../models/Review');
const bcrypt = require('bcryptjs');

dotenv.config();

const seedData = async () => {
  try {
    const connStr = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/gramincraft';
    await mongoose.connect(connStr);
    console.log('[Seeder] Connected to MongoDB...');

    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();
    await Review.deleteMany();

    const salt = await bcrypt.genSalt(10);
    const pass = await bcrypt.hash('password123', salt);

    // Create Artisans
    const artisan1 = await User.create({
      name: 'Sunita Devi',
      email: 'sunita.artisan@example.com',
      password: pass,
      role: 'artisan',
      phone: '+91 9823411098',
      craftSpecialty: 'Terracotta Pottery & Folk Painting',
      stateOfOrigin: 'Rajasthan',
      district: 'Rajsamand',
      village: 'Molela',
      bio: 'Master terracotta sculptor specializing in unglazed clay pottery and traditional folk narrative plaques.',
      rating: 4.9
    });

    const artisan2 = await User.create({
      name: 'Rameshwar Weaver',
      email: 'rameshwar.weaver@example.com',
      password: pass,
      role: 'artisan',
      phone: '+91 9456781234',
      craftSpecialty: 'Chanderi Handloom Weaving',
      stateOfOrigin: 'Madhya Pradesh',
      district: 'Ashoknagar',
      village: 'Chanderi',
      bio: 'Preserving 3 generations of heritage silk weaving with pure zari thread motifs.',
      rating: 5.0
    });

    // Create Buyer
    const buyer1 = await User.create({
      name: 'Aarav Mehta',
      email: 'buyer@example.com',
      password: pass,
      role: 'buyer',
      phone: '+91 9876543210'
    });

    console.log('[Seeder] Users created');

    // Create Products
    const prod1 = await Product.create({
      artisan: artisan1._id,
      artisanName: artisan1.name,
      title: 'Handcrafted Terracotta Clay Water Vessel',
      description: 'Traditionally molded unglazed terracotta water pot handcrafted by rural clay artisans of Molela village. Naturally cools drinking water and preserves mineral balance.',
      audioStory: 'Namaste! I am Sunita Devi from Molela village in Rajasthan. Our family has been practicing terracotta clay art for 4 generations.',
      price: 650,
      category: 'Pottery & Terracotta',
      stateOfOrigin: 'Rajasthan',
      materialsUsed: ['Natural River Clay', 'Organic Mineral Pigment'],
      stock: 15,
      images: [
        'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800',
        'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800'
      ],
      isFeatured: true,
      rating: 4.9,
      numReviews: 18,
      ecoFriendly: true
    });

    const prod2 = await Product.create({
      artisan: artisan2._id,
      artisanName: artisan2.name,
      title: 'Authentic Chanderi Silk Handloom Saree',
      description: 'Woven with pure Zari threads on wooden handlooms in Chanderi, Madhya Pradesh. Features traditional floral motifs and lightweight texture.',
      audioStory: 'Greetings! I am Rameshwar, a handloom weaver from Chanderi. It takes 7 full days of weaving for each saree.',
      price: 3400,
      category: 'Handloom & Textiles',
      stateOfOrigin: 'Madhya Pradesh',
      materialsUsed: ['Pure Mulberry Silk', 'Silver Zari Thread'],
      stock: 6,
      images: [
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800',
        'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800'
      ],
      isFeatured: true,
      rating: 5.0,
      numReviews: 24,
      ecoFriendly: true
    });

    console.log('[Seeder] Products created');

    // Create Reviews
    await Review.create({
      product: prod1._id,
      user: buyer1._id,
      userName: buyer1.name,
      rating: 5,
      comment: 'Superb quality clay pot. The water stays ice-cold naturally! Fast delivery and eco packaging.',
      artisanReply: 'Dhanyawad Aarav ji for encouraging our craft.'
    });

    console.log('[Seeder] Data seeding completed successfully!');
    process.exit();
  } catch (error) {
    console.error('[Seeder Error]:', error);
    process.exit(1);
  }
};

seedData();
