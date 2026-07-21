const Order = require("../models/Order.model");
const Product = require("../models/Product.model");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess, ApiError } = require("../utils/apiResponse");
const { ORDER_STATUS, ORDER_STATUS_TRANSITIONS, PAGINATION } = require("../utils/constants");

// ─────────────────────────────────────────
// @route   POST /api/orders
// @desc    Place a new order
// @access  Private (Buyer only)
// ─────────────────────────────────────────
const placeOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress, paymentMethod = "cod" } = req.body;

  // Validate products exist and have sufficient stock
  const productIds = items.map((i) => i.product);
  const products = await Product.find({ _id: { $in: productIds }, isActive: true });

  if (products.length !== productIds.length) {
    throw new ApiError(400, "One or more products are unavailable");
  }

  // Ensure all products belong to the same seller (one order per seller)
  const sellerIds = [...new Set(products.map((p) => p.seller.toString()))];
  if (sellerIds.length > 1) {
    throw new ApiError(
      400,
      "All products in an order must belong to the same seller. Please place separate orders."
    );
  }

  // Build order items and validate stock
  let totalAmount = 0;
  const orderItems = [];

  for (const item of items) {
    const product = products.find((p) => p._id.toString() === item.product.toString());
    if (product.stock < item.quantity) {
      throw new ApiError(400, `Insufficient stock for "${product.title}". Available: ${product.stock}`);
    }

    orderItems.push({
      product: product._id,
      title: product.title,
      price: product.price,
      quantity: item.quantity,
      image: product.images[0]?.url || "",
    });

    totalAmount += product.price * item.quantity;
  }

  // Create order
  const order = await Order.create({
    buyer: req.user._id,
    seller: sellerIds[0],
    items: orderItems,
    shippingAddress,
    totalAmount,
    paymentMethod,
  });

  // Decrement stock for each product
  const stockUpdates = items.map((item) =>
    Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } })
  );
  await Promise.all(stockUpdates);

  const populated = await order.populate([
    { path: "buyer", select: "name email" },
    { path: "seller", select: "name email" },
  ]);

  return sendSuccess(res, 201, "Order placed successfully", populated);
});

// ─────────────────────────────────────────
// @route   GET /api/orders/my
// @desc    Get buyer's order history
// @access  Private (Buyer only)
// ─────────────────────────────────────────
const getBuyerOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = PAGINATION.DEFAULT_LIMIT, status } = req.query;

  const query = { buyer: req.user._id };
  if (status) query.orderStatus = status;

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const [orders, total] = await Promise.all([
    Order.find(query)
      .populate("seller", "name avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum),
    Order.countDocuments(query),
  ]);

  return sendSuccess(res, 200, "Orders fetched", orders, {
    total,
    page: pageNum,
    limit: limitNum,
    totalPages: Math.ceil(total / limitNum),
  });
});

// ─────────────────────────────────────────
// @route   GET /api/orders/seller
// @desc    Get seller's received orders
// @access  Private (Seller only)
// ─────────────────────────────────────────
const getSellerOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = PAGINATION.DEFAULT_LIMIT, status } = req.query;

  const query = { seller: req.user._id };
  if (status) query.orderStatus = status;

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const [orders, total] = await Promise.all([
    Order.find(query)
      .populate("buyer", "name email avatar phone")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum),
    Order.countDocuments(query),
  ]);

  return sendSuccess(res, 200, "Seller orders fetched", orders, {
    total,
    page: pageNum,
    limit: limitNum,
    totalPages: Math.ceil(total / limitNum),
  });
});

// ─────────────────────────────────────────
// @route   GET /api/orders/:id
// @desc    Get single order by ID
// @access  Private (buyer who placed or seller who received)
// ─────────────────────────────────────────
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("buyer", "name email phone avatar")
    .populate("seller", "name email avatar");

  if (!order) throw new ApiError(404, "Order not found");

  const isBuyer = order.buyer._id.toString() === req.user._id.toString();
  const isSeller = order.seller._id.toString() === req.user._id.toString();

  if (!isBuyer && !isSeller) {
    throw new ApiError(403, "Not authorized to view this order");
  }

  return sendSuccess(res, 200, "Order fetched", order);
});

// ─────────────────────────────────────────
// @route   PATCH /api/orders/:id/status
// @desc    Update order status (seller only)
// @access  Private (Seller only)
// ─────────────────────────────────────────
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, note } = req.body;

  const order = await Order.findById(req.params.id);
  if (!order) throw new ApiError(404, "Order not found");

  if (order.seller.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not authorized to update this order");
  }

  // Validate status transition
  const allowedTransitions = ORDER_STATUS_TRANSITIONS[order.orderStatus] || [];
  if (!allowedTransitions.includes(status)) {
    throw new ApiError(
      400,
      `Cannot transition from "${order.orderStatus}" to "${status}". Allowed: ${allowedTransitions.join(", ") || "none"}`
    );
  }

  order.orderStatus = status;
  order.statusHistory.push({ status, timestamp: new Date(), note: note || "" });

  // Mark as paid when delivered (COD)
  if (status === ORDER_STATUS.DELIVERED && order.paymentMethod === "cod") {
    order.paymentStatus = "paid";
  }

  await order.save();
  return sendSuccess(res, 200, "Order status updated", order);
});

// ─────────────────────────────────────────
// @route   PATCH /api/orders/:id/cancel
// @desc    Cancel order (buyer can cancel if pending/accepted)
// @access  Private (Buyer only)
// ─────────────────────────────────────────
const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw new ApiError(404, "Order not found");

  if (order.buyer.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not authorized to cancel this order");
  }

  const cancellableStatuses = [ORDER_STATUS.PENDING, ORDER_STATUS.ACCEPTED];
  if (!cancellableStatuses.includes(order.orderStatus)) {
    throw new ApiError(400, `Cannot cancel order with status "${order.orderStatus}"`);
  }

  // Restore stock
  const restorePromises = order.items.map((item) =>
    Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } })
  );
  await Promise.all(restorePromises);

  order.orderStatus = ORDER_STATUS.CANCELLED;
  order.statusHistory.push({ status: ORDER_STATUS.CANCELLED, timestamp: new Date(), note: "Cancelled by buyer" });
  await order.save();

  return sendSuccess(res, 200, "Order cancelled successfully", order);
});

module.exports = {
  placeOrder,
  getBuyerOrders,
  getSellerOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
};
