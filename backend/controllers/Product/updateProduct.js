const product = require('../../models/product');

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!id) {
      return res.status(400).json({ status: false, error: 'Invalid product ID' });
    }

    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({ status: false, error: 'No update data provided' });
    }

    const existingProduct = await product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ status: false, error: 'Product not found' });
    }

    // Title uniqueness validation
    if (updates.title) {
      const normalizedTitle = updates.title.trim().toLowerCase();
      const titleExists = await product.findOne({
        title: normalizedTitle,
        _id: { $ne: id },
      });
      if (titleExists) {
        return res.status(409).json({
          status: false,
          error: 'Another product with this title already exists',
        });
      }
      existingProduct.title = normalizedTitle;
    }

    // Price validations
    if (updates.originalPrice !== undefined) {
      if (updates.originalPrice <= 0) {
        return res.status(400).json({ status: false, error: 'Original price must be greater than 0' });
      }
      existingProduct.originalPrice = updates.originalPrice;
    }

    if (updates.discountedPrice !== undefined) {
      if (updates.discountedPrice < 0) {
        return res.status(400).json({ status: false, error: 'Discounted price must not be smaller than 0' });
      }

      const original = updates.originalPrice ?? existingProduct.originalPrice;
      if (updates.discountedPrice >= original) {
        return res.status(400).json({ status: false, error: 'Discounted price must be less than original price' });
      }

      existingProduct.discountedPrice = updates.discountedPrice;
    }

    // Thumbnail
    if (updates.thumbnail !== undefined) {
      if (typeof updates.thumbnail !== 'string') {
        return res.status(400).json({ status: false, error: 'Thumbnail must be a valid image URL' });
      }
      existingProduct.thumbnail = updates.thumbnail;
    }

    // Images
    if (updates.images !== undefined) {
      if (!Array.isArray(updates.images)) {
        return res.status(400).json({ status: false, error: 'Images must be an array of URLs' });
      }
      if (updates.images.length < 1 || updates.images.length > 5) {
        return res.status(400).json({ status: false, error: 'Images must contain 1 to 5 URLs' });
      }
      existingProduct.images = updates.images;
    }

    // Colors
    if (updates.colors !== undefined) {
      if (!Array.isArray(updates.colors) || updates.colors.length === 0) {
        return res.status(400).json({ status: false, error: 'Colors must be a non-empty array' });
      }
      existingProduct.colors = updates.colors;
    }

    // Sizes
    if (updates.sizes !== undefined) {
      if (!Array.isArray(updates.sizes)) {
        return res.status(400).json({ status: false, error: 'Sizes must be an array' });
      }
      existingProduct.sizes = updates.sizes;
    }

    // Description
    if (updates.description !== undefined) {
      if (!Array.isArray(updates.description) || updates.description.length === 0) {
        return res.status(400).json({ status: false, error: 'Description must be a non-empty array' });
      }
      existingProduct.description = updates.description;
    }

    // Story
    if (updates.story !== undefined) {
      if (updates.story.length < 20) {
        return res.status(400).json({ status: false, error: 'Story must be at least 20 characters' });
      }
      existingProduct.story = updates.story;
    }

    // Tags 
    if (updates.tags !== undefined) {
      if (!Array.isArray(updates.tags)) {
        return res.status(400).json({ status: false, error: 'Tags must be an array' });
      }
      existingProduct.tags = updates.tags;
    }

    // Meta fields 
    if (updates.metaTitle) {
      existingProduct.metaTitle = updates.metaTitle.trim().toLowerCase();
    }
    if (updates.metaDescription) {
      existingProduct.metaDescription = updates.metaDescription.trim().toLowerCase();
    }
    if (updates.metaKeywords !== undefined) {
      if (!Array.isArray(updates.metaKeywords)) {
        return res.status(400).json({ status: false, error: 'Meta Keywords must be an array' });
      }
      existingProduct.metaKeywords = updates.metaKeywords;
    }

    // Save updated product (this triggers pre('validate') and pre('save'))
    await existingProduct.save();

    return res.status(200).json({
      status: true,
      message: 'Product updated successfully',
      product: existingProduct,
    });
  } catch (error) {
    console.error('Update product error:', error);
    return res.status(500).json({ status: false, error: error.message });
  }
};

module.exports = updateProduct;