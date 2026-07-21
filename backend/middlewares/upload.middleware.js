const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const { CLOUDINARY_FOLDERS } = require("../utils/constants");

// ─────────────────────────────────────────
// Product Images Storage
// ─────────────────────────────────────────
const productStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: CLOUDINARY_FOLDERS.PRODUCTS,
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 800, height: 800, crop: "limit", quality: "auto" }],
  },
});

// ─────────────────────────────────────────
// Avatar Storage
// ─────────────────────────────────────────
const avatarStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: CLOUDINARY_FOLDERS.AVATARS,
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 200, height: 200, crop: "fill", quality: "auto" }],
  },
});

// ─────────────────────────────────────────
// File Filter — only images
// ─────────────────────────────────────────
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPG, PNG, and WebP images are allowed."), false);
  }
};

// ─────────────────────────────────────────
// Upload Instances
// ─────────────────────────────────────────
const uploadProductImages = multer({
  storage: productStorage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB per file
    files: 5, // Max 5 images
  },
}).array("images", 5);

const uploadAvatar = multer({
  storage: avatarStorage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB for avatars
}).single("avatar");

module.exports = { uploadProductImages, uploadAvatar };
