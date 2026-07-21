const express = require("express");
const router = express.Router();

const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require("../controllers/cart.controller");

const { protect } = require("../middlewares/auth.middleware");
const { requireBuyer } = require("../middlewares/role.middleware");

// All cart routes require buyer authentication
router.use(protect, requireBuyer);

router.get("/", getCart);
router.post("/add", addToCart);
router.patch("/update", updateCartItem);
router.delete("/remove/:productId", removeFromCart);
router.delete("/clear", clearCart);

module.exports = router;
