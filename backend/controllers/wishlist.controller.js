const Wishlist = require("../models/Wishlist.model");
const Product = require("../models/Product.model");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess, ApiError } = require("../utils/apiResponse");

// ─────────────────────────────────────────
// @route   GET /api/wishlist
// @desc    Get user's wishlist
// @access  Private (Buyer only)
// ─────────────────────────────────────────
const getWishlist = asyncHandler(async (req, res) => {
  let wishlist = await Wishlist.findOne({ buyer: req.user._id }).populate({
    path: "products",
    select: "title price images rating category stock isActive seller",
    populate: { path: "seller", select: "name" },
  });

  if (!wishlist) {
    wishlist = await Wishlist.create({ buyer: req.user._id, products: [] });
  }

  return sendSuccess(res, 200, "Wishlist fetched", wishlist);
});

// ─────────────────────────────────────────
// @route   POST /api/wishlist/add/:productId
// @desc    Add product to wishlist
// @access  Private (Buyer only)
// ─────────────────────────────────────────
const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, "Product not found");

  let wishlist = await Wishlist.findOne({ buyer: req.user._id });
  if (!wishlist) {
    wishlist = await Wishlist.create({ buyer: req.user._id, products: [] });
  }

  const alreadyAdded = wishlist.products.some((p) => p.toString() === productId);
  if (alreadyAdded) {
    throw new ApiError(409, "Product already in wishlist");
  }

  wishlist.products.push(productId);
  await wishlist.save();

  return sendSuccess(res, 200, "Product added to wishlist");
});

// ─────────────────────────────────────────
// @route   DELETE /api/wishlist/remove/:productId
// @desc    Remove product from wishlist
// @access  Private (Buyer only)
// ─────────────────────────────────────────
const removeFromWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const wishlist = await Wishlist.findOne({ buyer: req.user._id });
  if (!wishlist) throw new ApiError(404, "Wishlist not found");

  wishlist.products = wishlist.products.filter((p) => p.toString() !== productId);
  await wishlist.save();

  return sendSuccess(res, 200, "Product removed from wishlist");
});

// ─────────────────────────────────────────
// @route   GET /api/wishlist/check/:productId
// @desc    Check if product is in wishlist
// @access  Private (Buyer only)
// ─────────────────────────────────────────
const checkWishlist = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOne({ buyer: req.user._id });
  const isWishlisted = wishlist
    ? wishlist.products.some((p) => p.toString() === req.params.productId)
    : false;

  return sendSuccess(res, 200, "Wishlist status checked", { isWishlisted });
});

module.exports = { getWishlist, addToWishlist, removeFromWishlist, checkWishlist };
