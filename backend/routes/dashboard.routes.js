const express = require("express");
const router = express.Router();

const {
  getDashboardStats,
  getMonthlySales,
  getCategoryStats,
} = require("../controllers/dashboard.controller");

const { protect } = require("../middlewares/auth.middleware");
const { requireSeller } = require("../middlewares/role.middleware");

// All dashboard routes require seller authentication
router.use(protect, requireSeller);

router.get("/stats", getDashboardStats);
router.get("/monthly-sales", getMonthlySales);
router.get("/category-stats", getCategoryStats);

module.exports = router;
