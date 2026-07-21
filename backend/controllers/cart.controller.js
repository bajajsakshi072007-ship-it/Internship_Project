const Cart = require("../models/Cart.model");
const Product = require("../models/Product.model");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess, ApiError } = require("../utils/apiResponse");

// Helper: Get cart with populated products
const getPopulatedCart = async (buyerId) => {
  return Cart.findOne({ buyer: buyerId }).populate({
    path: "items.product",
    select: "title price images stock seller isActive",
    populate: { path: "seller", select: "name" },
  });
};

// ─────────────────────────────────────────
// @route   GET /api/cart
// @desc    Get current user's cart
// @access  Private (Buyer only)
// ─────────────────────────────────────────
const getCart = asyncHandler(async (req, res) => {
  let cart = await getPopulatedCart(req.user._id);
  if (!cart) {
    cart = await Cart.create({ buyer: req.user._id, items: [] });
  }
  return sendSuccess(res, 200, "Cart fetched", cart);
});

// ─────────────────────────────────────────
// @route   POST /api/cart/add
// @desc    Add item to cart
// @access  Private (Buyer only)
// ─────────────────────────────────────────
const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  const product = await Product.findOne({ _id: productId, isActive: true });
  if (!product) throw new ApiError(404, "Product not found");
  if (product.stock < quantity) {
    throw new ApiError(400, `Only ${product.stock} units available in stock`);
  }

  let cart = await Cart.findOne({ buyer: req.user._id });
  if (!cart) {
    cart = await Cart.create({ buyer: req.user._id, items: [] });
  }

  const existingItemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId
  );

  if (existingItemIndex > -1) {
    const newQty = cart.items[existingItemIndex].quantity + quantity;
    if (newQty > product.stock) {
      throw new ApiError(400, `Cannot add more. Only ${product.stock} units available.`);
    }
    cart.items[existingItemIndex].quantity = newQty;
  } else {
    cart.items.push({ product: productId, quantity });
  }

  await cart.save();
  const populated = await getPopulatedCart(req.user._id);
  return sendSuccess(res, 200, "Item added to cart", populated);
});

// ─────────────────────────────────────────
// @route   PATCH /api/cart/update
// @desc    Update item quantity in cart
// @access  Private (Buyer only)
// ─────────────────────────────────────────
const updateCartItem = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;

  if (quantity < 1) throw new ApiError(400, "Quantity must be at least 1");

  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, "Product not found");
  if (product.stock < quantity) {
    throw new ApiError(400, `Only ${product.stock} units available`);
  }

  const cart = await Cart.findOne({ buyer: req.user._id });
  if (!cart) throw new ApiError(404, "Cart not found");

  const item = cart.items.find((i) => i.product.toString() === productId);
  if (!item) throw new ApiError(404, "Item not found in cart");

  item.quantity = quantity;
  await cart.save();

  const populated = await getPopulatedCart(req.user._id);
  return sendSuccess(res, 200, "Cart updated", populated);
});

// ─────────────────────────────────────────
// @route   DELETE /api/cart/remove/:productId
// @desc    Remove item from cart
// @access  Private (Buyer only)
// ─────────────────────────────────────────
const removeFromCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ buyer: req.user._id });
  if (!cart) throw new ApiError(404, "Cart not found");

  cart.items = cart.items.filter(
    (item) => item.product.toString() !== req.params.productId
  );
  await cart.save();

  const populated = await getPopulatedCart(req.user._id);
  return sendSuccess(res, 200, "Item removed from cart", populated);
});

// ─────────────────────────────────────────
// @route   DELETE /api/cart/clear
// @desc    Clear entire cart
// @access  Private (Buyer only)
// ─────────────────────────────────────────
const clearCart = asyncHandler(async (req, res) => {
  await Cart.findOneAndUpdate(
    { buyer: req.user._id },
    { $set: { items: [] } },
    { upsert: true }
  );
  return sendSuccess(res, 200, "Cart cleared");
});

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
