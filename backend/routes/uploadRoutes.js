const express = require('express');
const router = express.Router();
const { upload } = require('../config/localUpload');

// @route   POST /api/upload
// @desc    Upload an image to Cloudinary and return the URL
// @access  Public (in production, might want protect)
router.post('/', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    // Return local server URL
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.json({ url: imageUrl });
  } catch (err) {
    res.status(500).json({ message: 'Error uploading image', error: err.message });
  }
});

module.exports = router;
