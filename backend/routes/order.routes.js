const express = require("express");
const router = express.Router();

const {
  placeOrder,
  getBuyerOrders,
  getSellerOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
} = require("../controllers/order.controller");

const { protect } = require("../middlewares/auth.middleware");
const { requireBuyer, requireSeller } = require("../middlewares/role.middleware");
const validate = require("../middlewares/validate.middleware");
const {
  placeOrderValidator,
  updateOrderStatusValidator,
} = require("../validators/order.validator");

// Buyer routes
router.post("/", protect, requireBuyer, placeOrderValidator, validate, placeOrder);
router.get("/my", protect, requireBuyer, getBuyerOrders);
router.patch("/:id/cancel", protect, requireBuyer, cancelOrder);

// Seller routes
router.get("/seller", protect, requireSeller, getSellerOrders);
router.patch(
  "/:id/status",
  protect,
  requireSeller,
  updateOrderStatusValidator,
  validate,
  updateOrderStatus
);

// Shared (buyer or seller of the order)
router.get("/:id", protect, getOrderById);

module.exports = router;
