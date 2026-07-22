const Review = require("../models/Review.model");
const Order = require("../models/Order.model");
const Product = require("../models/Product.model");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess, ApiError } = require("../utils/apiResponse");
const { ORDER_STATUS } = require("../utils/constants");

// ─────────────────────────────────────────
// @route   GET /api/reviews/product/:productId
// @desc    Get all reviews for a product
// @access  Public
// ─────────────────────────────────────────
const getProductReviews = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const [reviews, total] = await Promise.all([
    Review.find({ product: req.params.productId })
      .populate("buyer", "name avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum),
    Review.countDocuments({ product: req.params.productId }),
  ]);

  return sendSuccess(res, 200, "Reviews fetched", reviews, {
    total,
    page: pageNum,
    limit: limitNum,
    totalPages: Math.ceil(total / limitNum),
  });
});

// ─────────────────────────────────────────
// @route   POST /api/reviews/product/:productId
// @desc    Add a review (verified buyer only)
// @access  Private (Buyer only)
// ─────────────────────────────────────────
const addReview = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { rating, comment } = req.body;

  // Check product exists
  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, "Product not found");

  // Check if buyer has a completed/delivered order for this product
  const verifiedOrder = await Order.findOne({
    buyer: req.user._id,
    "items.product": productId,
    orderStatus: { $in: [ORDER_STATUS.DELIVERED, ORDER_STATUS.COMPLETED] },
  });

  if (!verifiedOrder) {
    throw new ApiError(403, "You can only review products you have purchased and received");
  }

  // Check for existing review
  const existingReview = await Review.findOne({ buyer: req.user._id, product: productId });
  if (existingReview) {
    throw new ApiError(409, "You have already reviewed this product. You can edit your existing review.");
  }

  const review = await Review.create({
    buyer: req.user._id,
    product: productId,
    rating: Number(rating),
    comment,
  });

  await review.populate("buyer", "name avatar");

  return sendSuccess(res, 201, "Review added successfully", review);
});

// ─────────────────────────────────────────
// @route   PUT /api/reviews/:id
// @desc    Update own review
// @access  Private (Buyer — owner only)
// ─────────────────────────────────────────
const updateReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) throw new ApiError(404, "Review not found");

  if (review.buyer.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not authorized to edit this review");
  }

  const { rating, comment } = req.body;
  if (rating) review.rating = Number(rating);
  if (comment) review.comment = comment;

  await review.save();
  await review.populate("buyer", "name avatar");

  return sendSuccess(res, 200, "Review updated", review);
});

// ─────────────────────────────────────────
// @route   DELETE /api/reviews/:id
// @desc    Delete own review
// @access  Private (Buyer — owner only)
// ─────────────────────────────────────────
const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) throw new ApiError(404, "Review not found");

  if (review.buyer.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not authorized to delete this review");
  }

  await review.deleteOne();

  return sendSuccess(res, 200, "Review deleted successfully");
});

module.exports = { getProductReviews, addReview, updateReview, deleteReview };
