const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getArtisanOrders,
  updateOrderStatus,
  getArtisanAnalytics
} = require('../controllers/orderController');
const { protect, isArtisan } = require('../middleware/authMiddleware');

router.post('/', protect, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/artisan/orders', protect, isArtisan, getArtisanOrders);
router.get('/artisan/analytics', protect, isArtisan, getArtisanAnalytics);
router.put('/:id/status', protect, isArtisan, updateOrderStatus);

module.exports = router;
