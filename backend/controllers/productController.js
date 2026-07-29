const Product = require('../models/Product');
const mongoose = require('mongoose');

const isDBConnected = () => mongoose.connection.readyState === 1;

// Sample fallback crafts array for instant demo if DB is empty/offline
const fallbackProducts = [
  {
    _id: 'prod_1',
    artisan: 'mock_artisan_1',
    artisanName: 'Sunita Devi',
    title: 'Handcrafted Terracotta Clay Water Vessel',
    description: 'Traditionally molded unglazed terracotta water pot handcrafted by rural clay artisans of Molela village. Naturally cools drinking water and preserves mineral balance.',
    audioStory: 'Namaste! I am Sunita Devi from Molela village in Rajasthan. Our family has been practicing terracotta clay art for 4 generations. Every pot is turned on a hand wheel and sun-baked.',
    price: 650,
    category: 'Pottery & Terracotta',
    stateOfOrigin: 'Rajasthan',
    materialsUsed: ['Natural River Clay', 'Organic Mineral Pigment'],
    stock: 12,
    images: [
      'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800',
      'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800'
    ],
    isFeatured: true,
    rating: 4.9,
    numReviews: 18,
    ecoFriendly: true,
    createdAt: new Date()
  },
  {
    _id: 'prod_2',
    artisan: 'mock_artisan_2',
    artisanName: 'Rameshwar Weaver',
    title: 'Authentic Chanderi Silk Handloom Saree',
    description: 'Woven with pure Zari threads on wooden handlooms in Chanderi, Madhya Pradesh. Features traditional floral motifs (buttis) and lightweight breathable texture.',
    audioStory: 'Greetings! I am Rameshwar, a handloom weaver from Chanderi. It takes 7 full days of meticulous handloom weaving to create this single masterpiece.',
    price: 3400,
    category: 'Handloom & Textiles',
    stateOfOrigin: 'Madhya Pradesh',
    materialsUsed: ['Pure Mulberry Silk', 'Silver Zari Thread'],
    stock: 5,
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800'
    ],
    isFeatured: true,
    rating: 5.0,
    numReviews: 24,
    ecoFriendly: true,
    createdAt: new Date()
  },
  {
    _id: 'prod_3',
    artisan: 'mock_artisan_3',
    artisanName: 'Biren Mahato',
    title: 'Tribal Dhokra Brass Elephant Figurine',
    description: 'Ancient lost-wax bell metal craft practiced by tribal artisans of Bankura. Hand-drawn wax threads create ornate motifs before bronze casting.',
    audioStory: 'Pranam! I am Biren from West Bengal. Dhokra is a 4,000-year-old non-ferrous metal casting art that requires immense patience and beeswax modeling.',
    price: 1200,
    category: 'Metalcraft & Dhokra',
    stateOfOrigin: 'West Bengal',
    materialsUsed: ['Recycled Brass', 'Natural Beeswax'],
    stock: 8,
    images: [
      'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800'
    ],
    isFeatured: true,
    rating: 4.8,
    numReviews: 12,
    ecoFriendly: true,
    createdAt: new Date()
  },
  {
    _id: 'prod_4',
    artisan: 'mock_artisan_4',
    artisanName: 'Bhavna Ben',
    title: 'Hand-Carved Teakwood Decorative Wall Panel',
    description: 'Exquisite floral hand-carving on seasoned Indian teak wood. Sealed with natural beeswax polish for lasting beauty and luster.',
    audioStory: 'Hello friends! I am Bhavna Ben from Kutch, Gujarat. We hand-carve solid teak timber into traditional royal motifs passed down from our ancestors.',
    price: 2150,
    category: 'Woodcraft & Carvings',
    stateOfOrigin: 'Gujarat',
    materialsUsed: ['Seasoned Teak Wood', 'Beeswax Polish'],
    stock: 4,
    images: [
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800',
      'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=800'
    ],
    isFeatured: false,
    rating: 4.7,
    numReviews: 9,
    ecoFriendly: true,
    createdAt: new Date()
  },
  {
    _id: 'prod_5',
    artisan: 'mock_artisan_1',
    artisanName: 'Sunita Devi',
    title: 'Madhubani Hand-Painted Canvas Wall Art',
    description: 'Traditional Mithila folk painting crafted using natural twig brushes and organic plant dyes. Portrays peacocks and tree of life motifs symbolizing harmony.',
    audioStory: 'Madhubani art uses natural vegetable dyes extracted from turmeric, indigo, and marigold flowers.',
    price: 1800,
    category: 'Folk Art & Paintings',
    stateOfOrigin: 'Bihar',
    materialsUsed: ['Handmade Paper', 'Natural Vegetable Dyes'],
    stock: 7,
    images: [
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800',
      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800'
    ],
    isFeatured: true,
    rating: 5.0,
    numReviews: 15,
    ecoFriendly: true,
    createdAt: new Date()
  }
];

let localProducts = [...fallbackProducts];

// @desc    Fetch all products with filtering & search
// @route   GET /api/products
const getProducts = async (req, res) => {
  try {
    const { category, stateOfOrigin, search, minPrice, maxPrice, featured } = req.query;

    if (isDBConnected()) {
      let query = {};

      if (category && category !== 'All') query.category = category;
      if (stateOfOrigin && stateOfOrigin !== 'All') query.stateOfOrigin = stateOfOrigin;
      if (featured === 'true') query.isFeatured = true;

      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
      }

      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { artisanName: { $regex: search, $options: 'i' } }
        ];
      }

      const products = await Product.find(query).sort({ createdAt: -1 });

      // If DB has no products yet, seed automatically
      if (products.length === 0 && Object.keys(query).length === 0) {
        return res.json(localProducts);
      }

      return res.json(products);
    } else {
      // Mock filtering
      let result = [...localProducts];

      if (category && category !== 'All') {
        result = result.filter(p => p.category === category);
      }
      if (stateOfOrigin && stateOfOrigin !== 'All') {
        result = result.filter(p => p.stateOfOrigin === stateOfOrigin);
      }
      if (featured === 'true') {
        result = result.filter(p => p.isFeatured);
      }
      if (minPrice) {
        result = result.filter(p => p.price >= Number(minPrice));
      }
      if (maxPrice) {
        result = result.filter(p => p.price <= Number(maxPrice));
      }
      if (search) {
        const q = search.toLowerCase();
        result = result.filter(
          p =>
            p.title.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.artisanName.toLowerCase().includes(q)
        );
      }

      return res.json(result);
    }
  } catch (error) {
    console.error('Get Products Error:', error);
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
};

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (isDBConnected()) {
      const product = await Product.findById(id);
      if (product) return res.json(product);
    }

    const fallback = localProducts.find(p => p._id.toString() === id.toString());
    if (fallback) return res.json(fallback);

    res.status(404).json({ message: 'Product not found' });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product details', error: error.message });
  }
};

// @desc    Create new product listing (Artisan only)
// @route   POST /api/products
const createProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      audioStory,
      price,
      category,
      stateOfOrigin,
      materialsUsed,
      dimensions,
      weight,
      stock,
      images,
      ecoFriendly
    } = req.body;

    if (!title || !price || !category || !stateOfOrigin || !images || images.length === 0) {
      return res.status(400).json({ message: 'Please provide all required product fields & images' });
    }

    const artisanId = req.user.id || req.user._id || 'mock_artisan_1';
    const artisanName = req.user.name || 'Artisan Seller';

    if (isDBConnected()) {
      const product = await Product.create({
        artisan: artisanId,
        artisanName,
        title,
        description,
        audioStory: audioStory || '',
        price: Number(price),
        category,
        stateOfOrigin,
        materialsUsed: Array.isArray(materialsUsed) ? materialsUsed : (materialsUsed ? materialsUsed.split(',') : []),
        dimensions: dimensions || '',
        weight: weight || '',
        stock: Number(stock) || 1,
        images,
        ecoFriendly: ecoFriendly !== undefined ? ecoFriendly : true
      });

      return res.status(201).json(product);
    } else {
      const newProduct = {
        _id: 'prod_' + Date.now(),
        artisan: artisanId,
        artisanName,
        title,
        description,
        audioStory: audioStory || '',
        price: Number(price),
        category,
        stateOfOrigin,
        materialsUsed: Array.isArray(materialsUsed) ? materialsUsed : (materialsUsed ? materialsUsed.split(',') : []),
        dimensions: dimensions || '',
        weight: weight || '',
        stock: Number(stock) || 1,
        images,
        isFeatured: false,
        rating: 5.0,
        numReviews: 0,
        ecoFriendly: true,
        createdAt: new Date()
      };

      localProducts.unshift(newProduct);
      return res.status(201).json(newProduct);
    }
  } catch (error) {
    console.error('Create Product Error:', error);
    res.status(500).json({ message: 'Error creating product listing', error: error.message });
  }
};

// @desc    Update product listing (Artisan owner only)
// @route   PUT /api/products/:id
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      audioStory,
      price,
      category,
      stateOfOrigin,
      materialsUsed,
      dimensions,
      weight,
      stock,
      images,
      ecoFriendly
    } = req.body;

    const currentUserId = req.user.id || req.user._id || 'mock_artisan_1';

    if (isDBConnected()) {
      let product = await Product.findById(id);
      if (!product) return res.status(404).json({ message: 'Product not found' });

      // Check ownership
      if (product.artisan.toString() !== currentUserId.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to edit this product' });
      }

      if (title !== undefined) product.title = title;
      if (description !== undefined) product.description = description;
      if (audioStory !== undefined) product.audioStory = audioStory;
      if (price !== undefined) product.price = Number(price);
      if (category !== undefined) product.category = category;
      if (stateOfOrigin !== undefined) product.stateOfOrigin = stateOfOrigin;
      if (materialsUsed !== undefined) {
        product.materialsUsed = Array.isArray(materialsUsed)
          ? materialsUsed
          : materialsUsed.split(',').map((s) => s.trim()).filter(Boolean);
      }
      if (dimensions !== undefined) product.dimensions = dimensions;
      if (weight !== undefined) product.weight = weight;
      if (stock !== undefined) product.stock = Number(stock);
      if (images !== undefined) product.images = images;
      if (ecoFriendly !== undefined) product.ecoFriendly = ecoFriendly;

      const updatedProduct = await product.save();
      return res.json(updatedProduct);
    } else {
      const index = localProducts.findIndex(p => p._id.toString() === id.toString());
      if (index === -1) return res.status(404).json({ message: 'Product not found' });

      const prod = localProducts[index];
      if (prod.artisan && prod.artisan !== 'mock_artisan_1' && prod.artisan.toString() !== currentUserId.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to edit this product' });
      }

      const updated = {
        ...prod,
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(audioStory !== undefined && { audioStory }),
        ...(price !== undefined && { price: Number(price) }),
        ...(category !== undefined && { category }),
        ...(stateOfOrigin !== undefined && { stateOfOrigin }),
        ...(materialsUsed !== undefined && {
          materialsUsed: Array.isArray(materialsUsed)
            ? materialsUsed
            : materialsUsed.split(',').map((s) => s.trim()).filter(Boolean)
        }),
        ...(dimensions !== undefined && { dimensions }),
        ...(weight !== undefined && { weight }),
        ...(stock !== undefined && { stock: Number(stock) }),
        ...(images !== undefined && { images }),
        ...(ecoFriendly !== undefined && { ecoFriendly })
      };

      localProducts[index] = updated;
      return res.json(updated);
    }
  } catch (error) {
    console.error('Update Product Error:', error);
    res.status(500).json({ message: 'Error updating product listing', error: error.message });
  }
};

// @desc    Delete product listing
// @route   DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user.id || req.user._id || 'mock_artisan_1';

    if (isDBConnected()) {
      const product = await Product.findById(id);
      if (!product) return res.status(404).json({ message: 'Product not found' });

      if (product.artisan.toString() !== currentUserId.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to delete this product' });
      }

      await product.deleteOne();
      return res.json({ success: true, message: 'Product and associated images removed successfully' });
    } else {
      localProducts = localProducts.filter(p => p._id.toString() !== id.toString());
      return res.json({ success: true, message: 'Product removed successfully (mock mode)' });
    }
  } catch (error) {
    console.error('Delete Product Error:', error);
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
};

// @desc    Get products listed by logged-in Artisan
// @route   GET /api/products/artisan/my-products
const getMyArtisanProducts = async (req, res) => {
  try {
    const artisanId = req.user.id || req.user._id;

    if (isDBConnected()) {
      const products = await Product.find({ artisan: artisanId }).sort({ createdAt: -1 });
      return res.json(products);
    } else {
      const myProds = localProducts.filter(
        p => p.artisan.toString() === artisanId.toString() || p.artisan === 'mock_artisan_1'
      );
      return res.json(myProds);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching artisan products', error: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getMyArtisanProducts
};
