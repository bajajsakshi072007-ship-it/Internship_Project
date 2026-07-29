const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getMyArtisanProducts
} = require('../controllers/productController');
const { protect, isArtisan } = require('../middleware/authMiddleware');

router.get('/', getProducts);
router.get('/artisan/my-products', protect, isArtisan, getMyArtisanProducts);
router.get('/:id', getProductById);
router.post('/', protect, isArtisan, createProduct);
router.put('/:id', protect, isArtisan, updateProduct);
router.delete('/:id', protect, isArtisan, deleteProduct);

module.exports = router;
