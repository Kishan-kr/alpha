const multer = require("multer");
const { MAX_IMAGE_SIZE } = require("../utilis/constants");
const { uploadToR2 } = require("../services/configR2");

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: MAX_IMAGE_SIZE
  },
});

const uploadCategoryThumbnail = async (req, res, next) => {
  console.log('reached to middleware...' );
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

module.exports = { uploadCategoryThumbnail, upload };