const User = require("../models/User.model");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess, ApiError } = require("../utils/apiResponse");
const generateToken = require("../utils/generateToken");
const { deleteImage } = require("../services/cloudinary.service");

// ─────────────────────────────────────────
// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
// ─────────────────────────────────────────
const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, phone } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "An account with this email already exists");
  }

  const user = await User.create({ name, email, password, role, phone });
  const token = generateToken({ id: user._id, role: user.role });

  return sendSuccess(res, 201, "Registration successful", { user, token });
});

// ─────────────────────────────────────────
// @route   POST /api/auth/login
// @desc    Login user and return JWT
// @access  Public
// ─────────────────────────────────────────
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Select password explicitly (it's hidden by default)
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  if (!user.isActive) {
    throw new ApiError(403, "Your account has been deactivated. Contact support.");
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = generateToken({ id: user._id, role: user.role });

  // Remove password from response
  user.password = undefined;

  return sendSuccess(res, 200, "Login successful", { user, token });
});

// ─────────────────────────────────────────
// @route   GET /api/auth/profile
// @desc    Get current logged-in user profile
// @access  Private
// ─────────────────────────────────────────
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) throw new ApiError(404, "User not found");
  return sendSuccess(res, 200, "Profile fetched", user);
});

// ─────────────────────────────────────────
// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
// ─────────────────────────────────────────
const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, bio, address } = req.body;

  const updateFields = {};
  if (name) updateFields.name = name;
  if (phone) updateFields.phone = phone;
  if (bio !== undefined) updateFields.bio = bio;
  if (address) updateFields.address = address;

  // Handle avatar upload
  if (req.file) {
    // Delete old avatar from Cloudinary if exists
    const currentUser = await User.findById(req.user._id);
    if (currentUser.avatar?.publicId) {
      await deleteImage(currentUser.avatar.publicId);
    }
    updateFields.avatar = {
      url: req.file.path,
      publicId: req.file.filename,
    };
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: updateFields },
    { new: true, runValidators: true }
  );

  return sendSuccess(res, 200, "Profile updated successfully", user);
});

// ─────────────────────────────────────────
// @route   PUT /api/auth/change-password
// @desc    Change user password
// @access  Private
// ─────────────────────────────────────────
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select("+password");
  const isPasswordValid = await user.comparePassword(currentPassword);

  if (!isPasswordValid) {
    throw new ApiError(400, "Current password is incorrect");
  }

  user.password = newPassword;
  await user.save();

  return sendSuccess(res, 200, "Password changed successfully");
});

// ─────────────────────────────────────────
// @route   POST /api/auth/logout
// @desc    Logout (client-side token removal, API confirms)
// @access  Private
// ─────────────────────────────────────────
const logout = asyncHandler(async (req, res) => {
  return sendSuccess(res, 200, "Logged out successfully");
});

module.exports = { register, login, getProfile, updateProfile, changePassword, logout };
