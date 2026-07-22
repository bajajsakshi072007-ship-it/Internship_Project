const express = require("express");
const router = express.Router();

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  removeProductImage,
  getMyProducts,
} = require("../controllers/product.controller");

const { protect } = require("../middlewares/auth.middleware");
const { requireSeller } = require("../middlewares/role.middleware");
const { uploadProductImages } = require("../middlewares/upload.middleware");
const validate = require("../middlewares/validate.middleware");
const {
  createProductValidator,
  updateProductValidator,
} = require("../validators/product.validator");

// Public routes
router.get("/", getProducts);
router.get("/seller/mine", protect, requireSeller, getMyProducts);
router.get("/:id", getProductById);

// Seller-only routes
router.post(
  "/",
  protect,
  requireSeller,
  uploadProductImages,
  createProductValidator,
  validate,
  createProduct
);

router.put(
  "/:id",
  protect,
  requireSeller,
  uploadProductImages,
  updateProductValidator,
  validate,
  updateProduct
);

router.delete("/:id", protect, requireSeller, deleteProduct);
router.delete("/:id/images/:publicId", protect, requireSeller, removeProductImage);

module.exports = router;
