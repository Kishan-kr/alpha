const { uploadToR2 } = require('../../services/configR2')

const uploadImages = async (req, res) => {
  try {
    const files = req.files;

    if (!files?.thumbnail || !files?.images) {
      return res.status(400).json({ error: 'Thumbnail and product images are required' });
    }

    const uploaded = {
      thumbnail: null,
      images: [],
    };

    // Upload thumbnail
    uploaded.thumbnail = await uploadToR2(
      files.thumbnail[0].buffer,
      files.thumbnail[0].originalname
    );

    // Upload product images
    for (const img of files.images) {
      const url = await uploadToR2(img.buffer, img.originalname);
      uploaded.images.push(url);
    }

    return res.status(200).json(uploaded);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
};

module.exports = uploadImages;