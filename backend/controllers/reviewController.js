const Review = require('../models/Review');
const Product = require('../models/Product');
const mongoose = require('mongoose');

const isDBConnected = () => mongoose.connection.readyState === 1;

let localReviews = [
  {
    _id: 'rev_1',
    product: 'prod_1',
    user: 'mock_buyer_1',
    userName: 'Aarav Mehta',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
    rating: 5,
    comment: 'Exceptional craftsmanship! The clay vessel keeps water incredibly cool and refreshing. Proud to support rural artisans.',
    artisanReply: 'Dhanyawad Aarav ji! We are delighted that you love the unglazed terracotta clay pot.',
    createdAt: new Date(Date.now() - 86400000 * 3)
  },
  {
    _id: 'rev_2',
    product: 'prod_2',
    user: 'mock_buyer_2',
    userName: 'Kavita Sen',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    rating: 5,
    comment: 'The saree drape and zari shine are so delicate. You can feel the true handloom weaving quality!',
    artisanReply: 'Thank you Kavita ji! Each motif is woven with love in Chanderi.',
    createdAt: new Date(Date.now() - 86400000 * 5)
  }
];

// @desc    Get reviews for a product
// @route   GET /api/reviews/product/:productId
const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    if (isDBConnected()) {
      const reviews = await Review.find({ product: productId }).sort({ createdAt: -1 });
      return res.json(reviews);
    } else {
      const reviews = localReviews.filter(r => r.product.toString() === productId.toString());
      return res.json(reviews);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews', error: error.message });
  }
};

// @desc    Add review for a product
// @route   POST /api/reviews/product/:productId
const addReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, comment } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({ message: 'Rating and comment are required' });
    }

    const userId = req.user.id || req.user._id || 'mock_buyer_1';
    const userName = req.user.name || 'Verified Buyer';

    if (isDBConnected()) {
      const review = await Review.create({
        product: productId,
        user: userId,
        userName,
        rating: Number(rating),
        comment
      });

      // Update product rating summary
      const allReviews = await Review.find({ product: productId });
      const avg = allReviews.reduce((acc, item) => item.rating + acc, 0) / allReviews.length;

      await Product.findByIdAndUpdate(productId, {
        rating: Number(avg.toFixed(1)),
        numReviews: allReviews.length
      });

      return res.status(201).json(review);
    } else {
      const newRev = {
        _id: 'rev_' + Date.now(),
        product: productId,
        user: userId,
        userName,
        rating: Number(rating),
        comment,
        artisanReply: '',
        createdAt: new Date()
      };
      localReviews.unshift(newRev);
      return res.status(201).json(newRev);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error adding review', error: error.message });
  }
};

// @desc    Artisan reply to review
// @route   PUT /api/reviews/:id/reply
const replyToReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { artisanReply } = req.body;

    if (isDBConnected()) {
      const review = await Review.findById(id);
      if (!review) return res.status(404).json({ message: 'Review not found' });

      review.artisanReply = artisanReply;
      await review.save();
      return res.json(review);
    } else {
      const review = localReviews.find(r => r._id.toString() === id.toString());
      if (!review) return res.status(404).json({ message: 'Review not found' });

      review.artisanReply = artisanReply;
      return res.json(review);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error replying to review', error: error.message });
  }
};

module.exports = { getProductReviews, addReview, replyToReview };
