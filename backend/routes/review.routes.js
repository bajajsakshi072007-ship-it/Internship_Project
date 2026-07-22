const express = require("express");
const router = express.Router();

const {
  getProductReviews,
  addReview,
  updateReview,
  deleteReview,
} = require("../controllers/review.controller");

const { protect } = require("../middlewares/auth.middleware");
const { requireBuyer } = require("../middlewares/role.middleware");
const validate = require("../middlewares/validate.middleware");
const {
  createReviewValidator,
  updateReviewValidator,
} = require("../validators/review.validator");

// Public
router.get("/product/:productId", getProductReviews);

// Buyer only
router.post(
  "/product/:productId",
  protect,
  requireBuyer,
  createReviewValidator,
  validate,
  addReview
);

// Review owner only
router.put("/:id", protect, requireBuyer, updateReviewValidator, validate, updateReview);
router.delete("/:id", protect, requireBuyer, deleteReview);

module.exports = router;
