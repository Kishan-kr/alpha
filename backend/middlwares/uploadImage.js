const multer = require("multer");
const { MAX_IMAGE_SIZE } = require("../utils/constants");
const { uploadToR2 } = require("../services/configR2");

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: MAX_IMAGE_SIZE
  },
});

const uploadCategoryThumbnail = async (req, res, next) => {
  try {
    const file = req.file;
    
    if (file) {
      const thumbnailUrl = await uploadToR2(file.buffer, file.originalname);
      req.body.thumbnail = thumbnailUrl;
    }

    next();
  } catch (error) {
    console.error('Error uploading category thumbnail:', error.message);
    return res.status(500).json({ status: false, error: 'Failed to upload thumbnail image' });
  }
}

const uploadImagesIfPresent = async (req, res, next) => {
  try {
    const files = req.files;

    if (files && files.length > 0) {
      // Upload all files and collect URLs
      const imageUrls = await Promise.all(
        files.map(file => uploadToR2(file.buffer, file.originalname))
      );
  
      // Attach to request body or wherever you need
      req.body.images = imageUrls;
    }

    next();
  } catch (error) {
    console.error('Error uploading review images:', error.message);
    return res.status(500).json({ status: false, error: 'Failed to upload review images' });
  }
};

module.exports = { uploadCategoryThumbnail, upload, uploadImagesIfPresent };