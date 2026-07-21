const express = require("express");
const router = express.Router();

const {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  changePassword,
} = require("../controllers/auth.controller");

const { protect } = require("../middlewares/auth.middleware");
const { uploadAvatar } = require("../middlewares/upload.middleware");
const validate = require("../middlewares/validate.middleware");

const {
  registerValidator,
  loginValidator,
  updateProfileValidator,
  changePasswordValidator,
} = require("../validators/auth.validator");

// Public routes
router.post("/register", registerValidator, validate, register);
router.post("/login", loginValidator, validate, login);

// Protected routes
router.post("/logout", protect, logout);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, uploadAvatar, updateProfileValidator, validate, updateProfile);
router.put("/change-password", protect, changePasswordValidator, validate, changePassword);

module.exports = router;
