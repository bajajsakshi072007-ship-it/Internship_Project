const express = require("express");
const router = express.Router();

const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  checkWishlist,
} = require("../controllers/wishlist.controller");

const { protect } = require("../middlewares/auth.middleware");
const { requireBuyer } = require("../middlewares/role.middleware");

// All wishlist routes require buyer authentication
router.use(protect, requireBuyer);

router.get("/", getWishlist);
router.get("/check/:productId", checkWishlist);
router.post("/add/:productId", addToWishlist);
router.delete("/remove/:productId", removeFromWishlist);

module.exports = router;
