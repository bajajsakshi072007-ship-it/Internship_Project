const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const { extractImageData } = require("../services/cloudinary.service");

// ─────────────────────────────────────────
// @route   POST /api/upload/images
// @desc    Upload one or more images to Cloudinary
// @access  Private
// ─────────────────────────────────────────
const uploadImages = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return sendSuccess(res, 200, "No files uploaded", []);
  }

  const images = extractImageData(req.files);
  return sendSuccess(res, 200, "Images uploaded successfully", images);
});

// ─────────────────────────────────────────
// @route   POST /api/upload/avatar
// @desc    Upload profile avatar to Cloudinary
// @access  Private
// ─────────────────────────────────────────
const uploadAvatarImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    return sendSuccess(res, 200, "No file uploaded", null);
  }

  const image = {
    url: req.file.path,
    publicId: req.file.filename,
  };

  return sendSuccess(res, 200, "Avatar uploaded successfully", image);
});

module.exports = { uploadImages, uploadAvatarImage };
