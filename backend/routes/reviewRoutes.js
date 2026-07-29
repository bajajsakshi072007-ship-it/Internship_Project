const express = require('express');
const router = express.Router();
const { getProductReviews, addReview, replyToReview } = require('../controllers/reviewController');
const { protect, isArtisan } = require('../middleware/authMiddleware');

router.get('/product/:productId', getProductReviews);
router.post('/product/:productId', protect, addReview);
router.put('/:id/reply', protect, isArtisan, replyToReview);

module.exports = router;
