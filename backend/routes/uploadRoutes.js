const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { uploadImages } = require('../controllers/uploadController');
const { protect, isArtisan } = require('../middleware/authMiddleware');

router.post('/', protect, isArtisan, upload.array('images', 5), uploadImages);
router.post('/public', upload.array('images', 5), uploadImages);

module.exports = router;
