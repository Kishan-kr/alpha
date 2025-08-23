const express = require('express');
const multer = require('multer');
const uploadImages = require('../controllers/Images/upload');
const authenticateAdmin = require('../middlwares/authenticateAdmin');
const { MAX_IMAGE_SIZE } = require('../utils/constants');
const deleteImage = require('../controllers/Images/delete');

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: MAX_IMAGE_SIZE
  },
});

// POST /api/images             → Upload images
router.post(
  '/',
  authenticateAdmin,
  upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'images', maxCount: 5 }
  ]),
  uploadImages
);

// DELETE /api/images             → Delete an image
router.delete('/', authenticateAdmin, deleteImage)

module.exports = router;