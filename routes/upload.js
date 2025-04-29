const express = require('express');
const multer = require('multer');
const { storage } = require('../utils/cloudinary');

const upload = multer({ storage });

const router = express.Router();

router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  // Return Cloudinary URL
  res.json({ imageUrl: req.file.path });
});

module.exports = router;
