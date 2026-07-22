const Order = require("../models/Order.model");
const Product = require("../models/Product.model");
const Review = require("../models/Review.model");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const { ORDER_STATUS } = require("../utils/constants");

// ─────────────────────────────────────────
// @route   GET /api/dashboard/stats
// @desc    Get seller dashboard statistics
// @access  Private (Seller only)
// ─────────────────────────────────────────
const getDashboardStats = asyncHandler(async (req, res) => {
  const sellerId = req.user._id;

  const [
    totalProducts,
    orderStats,
    totalRevenue,
    lowStockProducts,
    recentOrders,
    recentReviews,
  ] = await Promise.all([
    // Total products
    Product.countDocuments({ seller: sellerId }),

    // Order counts by status
    Order.aggregate([
      { $match: { seller: sellerId } },
      { $group: { _id: "$orderStatus", count: { $sum: 1 } } },
    ]),

    // Total revenue (delivered + completed orders)
    Order.aggregate([
      {
        $match: {
          seller: sellerId,
          orderStatus: { $in: [ORDER_STATUS.DELIVERED, ORDER_STATUS.COMPLETED] },
        },
      },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]),

    // Low stock products (stock <= 5)
    Product.find({ seller: sellerId, stock: { $lte: 5 }, isActive: true })
      .select("title stock category images")
      .sort({ stock: 1 })
      .limit(5),

    // Recent orders
    Order.find({ seller: sellerId })
      .populate("buyer", "name email avatar")
      .sort({ createdAt: -1 })
      .limit(5),

    // Recent reviews on seller's products
    Review.find({})
      .populate("buyer", "name avatar")
      .populate({
        path: "product",
        match: { seller: sellerId },
        select: "title",
      })
      .sort({ createdAt: -1 })
      .limit(5),
  ]);

  // Format order stats
  const orderStatusMap = {};
  orderStats.forEach(({ _id, count }) => {
    orderStatusMap[_id] = count;
  });

  const stats = {
    totalProducts,
    totalOrders: orderStats.reduce((acc, s) => acc + s.count, 0),
    pendingOrders: orderStatusMap[ORDER_STATUS.PENDING] || 0,
    acceptedOrders: orderStatusMap[ORDER_STATUS.ACCEPTED] || 0,
    shippedOrders: orderStatusMap[ORDER_STATUS.SHIPPED] || 0,
    deliveredOrders: orderStatusMap[ORDER_STATUS.DELIVERED] || 0,
    completedOrders: orderStatusMap[ORDER_STATUS.COMPLETED] || 0,
    cancelledOrders: orderStatusMap[ORDER_STATUS.CANCELLED] || 0,
    totalRevenue: totalRevenue[0]?.total || 0,
  };

  return sendSuccess(res, 200, "Dashboard stats fetched", {
    stats,
    lowStockProducts,
    recentOrders,
    recentReviews: recentReviews.filter((r) => r.product), // filter out null products
  });
});

// ─────────────────────────────────────────
// @route   GET /api/dashboard/monthly-sales
// @desc    Get monthly sales data for charts
// @access  Private (Seller only)
// ─────────────────────────────────────────
const getMonthlySales = asyncHandler(async (req, res) => {
  const sellerId = req.user._id;
  const year = parseInt(req.query.year) || new Date().getFullYear();

  const monthlySales = await Order.aggregate([
    {
      $match: {
        seller: sellerId,
        orderStatus: { $in: [ORDER_STATUS.DELIVERED, ORDER_STATUS.COMPLETED] },
        createdAt: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { month: { $month: "$createdAt" } },
        revenue: { $sum: "$totalAmount" },
        orders: { $sum: 1 },
      },
    },
    { $sort: { "_id.month": 1 } },
  ]);

  // Fill all 12 months
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  const data = months.map((month, index) => {
    const found = monthlySales.find((m) => m._id.month === index + 1);
    return {
      month,
      revenue: found?.revenue || 0,
      orders: found?.orders || 0,
    };
  });

  return sendSuccess(res, 200, "Monthly sales fetched", { year, data });
});

// ─────────────────────────────────────────
// @route   GET /api/dashboard/category-stats
// @desc    Get product and revenue breakdown by category
// @access  Private (Seller only)
// ─────────────────────────────────────────
const getCategoryStats = asyncHandler(async (req, res) => {
  const sellerId = req.user._id;

  const categoryStats = await Product.aggregate([
    { $match: { seller: sellerId } },
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
        avgPrice: { $avg: "$price" },
      },
    },
    { $sort: { count: -1 } },
  ]);

  return sendSuccess(res, 200, "Category stats fetched", categoryStats);
});

module.exports = { getDashboardStats, getMonthlySales, getCategoryStats };
