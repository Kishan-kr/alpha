const { getFileKeyFromUrl, deleteFromR2 } = require("../../services/configR2");
const { INTERNAL_SERVER_ERROR } = require("../../utils/constants");

const deleteImage = async (req, res) => {
  const fileUrl = req.body.fileUrl;

  if (!fileUrl) {
    return res.status(400).json({ error: 'fileUrl is required' });
  }

  try {
    const key = getFileKeyFromUrl(fileUrl);

    if (!key) {
      return res.status(400).json({ error: 'Invalid file URL' });
    }

    const deleted = await deleteFromR2(key);

    if (deleted) {
      return res.status(200).json({ message: 'Image deleted successfully' });
    } else {
      return res.status(404).json({ error: 'Image not found or already deleted' });
    }
  } catch (error) {
    console.error('Error deleting file from R2:', error);
    return res.status(500).json({
      error: error.message || INTERNAL_SERVER_ERROR,
    });
  }
};

module.exports = deleteImage;