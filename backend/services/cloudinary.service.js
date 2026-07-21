const cloudinary = require("../config/cloudinary");

/**
 * Delete a single image from Cloudinary by its public ID
 * @param {string} publicId - Cloudinary public ID
 * @returns {Promise<Object>} Cloudinary deletion result
 */
const deleteImage = async (publicId) => {
  if (!publicId) return null;
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error(`Failed to delete Cloudinary image ${publicId}:`, error.message);
    return null;
  }
};

/**
 * Delete multiple images from Cloudinary by their public IDs
 * @param {Array<{publicId: string}>} images - Array of image objects with publicId
 * @returns {Promise<void>}
 */
const deleteImages = async (images = []) => {
  if (!images || images.length === 0) return;
  const deletePromises = images
    .filter((img) => img.publicId)
    .map((img) => deleteImage(img.publicId));
  await Promise.allSettled(deletePromises);
};

/**
 * Extract Cloudinary image data from Multer/Cloudinary uploaded files
 * @param {Array} files - req.files array from multer-storage-cloudinary
 * @returns {Array<{url: string, publicId: string}>}
 */
const extractImageData = (files = []) => {
  return files.map((file) => ({
    url: file.path,
    publicId: file.filename,
  }));
};

module.exports = { deleteImage, deleteImages, extractImageData };
