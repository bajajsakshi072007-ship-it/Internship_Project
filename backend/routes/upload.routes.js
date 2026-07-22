const express = require("express");
const router = express.Router();

const { uploadImages, uploadAvatarImage } = require("../controllers/upload.controller");
const { protect } = require("../middlewares/auth.middleware");
const { uploadProductImages, uploadAvatar } = require("../middlewares/upload.middleware");
const { uploadLimiter } = require("../middlewares/rateLimiter.middleware");

// All upload routes require authentication
router.use(protect, uploadLimiter);

// Upload product images (returns URLs for use in product creation)
router.post("/images", (req, res, next) => {
  uploadProductImages(req, res, (err) => {
    if (err) return next(err);
    next();
  });
}, uploadImages);

// Upload profile avatar
router.post("/avatar", (req, res, next) => {
  uploadAvatar(req, res, (err) => {
    if (err) return next(err);
    next();
  });
}, uploadAvatarImage);

module.exports = router;
