const cloudinary = require('cloudinary').v2;
const fs = require('fs');

if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

const uploadImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No images uploaded' });
    }

    const imageUrls = [];

    for (const file of req.files) {
      if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
        try {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: 'gramincraft_products'
          });
          imageUrls.push(result.secure_url);
          // remove temp local file after cloudinary upload
          fs.unlinkSync(file.path);
        } catch (err) {
          console.warn('Cloudinary upload failed, fallback to local URL:', err.message);
          const localUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
          imageUrls.push(localUrl);
        }
      } else {
        const localUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
        imageUrls.push(localUrl);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Images uploaded successfully',
      imageUrls
    });
  } catch (error) {
    console.error('Upload Error:', error);
    return res.status(500).json({ message: 'Upload failed', error: error.message });
  }
};

module.exports = { uploadImages };
