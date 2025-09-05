const { v4: uuidv4 } = require('uuid');
const { slugify } = require('../../utils/generateSlug');
const { buildVariantSet } = require('../../services/sizeReducer');
const path = require('path');

const uploadImagesWithVariants = async (req, res) => {
  try {
    const files = req.files;
    if (!files?.thumbnail || !files?.images) {
      return res.status(400).json({ error: 'Thumbnail and product images are required' });
    }

    const rawTitle = (req.body?.title || req.body?.name || '').trim();
    if (!rawTitle) {
      return res.status(400).json({ error: 'Missing product title/name in body' });
    }

    const baseSlug = slugify(rawTitle).toLowerCase();

    const result = {
      title: rawTitle,
      baseSlug,
      thumbnail: null,
      images: [],
    };

    // --- Thumbnail (single) ---
    {
      const f = files.thumbnail[0];
      const assetId = uuidv4();
      const slug = `${baseSlug}-thumbnail`;
      const keyPrefix = `products/${assetId}-${slug}`;
      const ext = path.extname(f.originalname);
      result.thumbnail = await buildVariantSet(
        f.buffer,
        keyPrefix,
        ext,
        f.mimetype
      );
      result.thumbnail.id = assetId;
      result.thumbnail.slug = slug;
    }

    // --- Product images (multiple) ---
    for (let i = 0; i < files.images.length; i++) {
      const f = files.images[i];
      const assetId = uuidv4();
      const slug = `${baseSlug}-${i + 1}`;
      const keyPrefix = `products/${assetId}-${slug}`;
      const ext = path.extname(f.originalname);
      const set = await buildVariantSet(
        f.buffer,
        keyPrefix,
        ext,
        f.mimetype
      );
      result.images.push({ id: assetId, slug, ...set });
    }

    // simplified version of urls also to be directly used in add product route
    const simplified = {
      thumbnail: result.thumbnail?.variants?.thumb_600x900?.jpg,
      images: result.images.map(img => img?.variants?.listing_1200?.jpg)
    };

    return res.status(200).json({ ...result, simplified });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: 'Upload failed' });
  }
};

module.exports = uploadImagesWithVariants;