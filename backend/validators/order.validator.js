const { body } = require("express-validator");

const placeOrderValidator = [
  body("items")
    .isArray({ min: 1 })
    .withMessage("Order must contain at least one item"),

  body("items.*.product")
    .notEmpty()
    .withMessage("Product ID is required for each item")
    .isMongoId()
    .withMessage("Invalid product ID"),

  body("items.*.quantity")
    .notEmpty()
    .withMessage("Quantity is required for each item")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),

  body("shippingAddress.name")
    .trim()
    .notEmpty()
    .withMessage("Recipient name is required"),

  body("shippingAddress.phone")
    .notEmpty()
    .withMessage("Phone number is required")
    .matches(/^[6-9]\d{9}$/)
    .withMessage("Please enter a valid 10-digit Indian mobile number"),

  body("shippingAddress.street")
    .trim()
    .notEmpty()
    .withMessage("Street address is required"),

  body("shippingAddress.city")
    .trim()
    .notEmpty()
    .withMessage("City is required"),

  body("shippingAddress.state")
    .trim()
    .notEmpty()
    .withMessage("State is required"),

  body("shippingAddress.pincode")
    .notEmpty()
    .withMessage("Pincode is required")
    .matches(/^\d{6}$/)
    .withMessage("Please enter a valid 6-digit pincode"),

  body("paymentMethod")
    .optional()
    .isIn(["cod", "online"])
    .withMessage("Payment method must be cod or online"),
];

const updateOrderStatusValidator = [
  body("status")
    .notEmpty()
    .withMessage("Order status is required")
    .isIn(["pending", "accepted", "packed", "shipped", "delivered", "completed", "cancelled"])
    .withMessage("Invalid order status"),
];

module.exports = { placeOrderValidator, updateOrderStatusValidator };
