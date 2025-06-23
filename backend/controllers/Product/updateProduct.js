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

    // Field validations
    if (updates.title && updates.title.length < 2) {
      return res.status(400).json({ status: false, error: 'Title must be at least 2 characters' });
    }

    if (updates.originalPrice && updates.originalPrice <= 0) {
      return res.status(400).json({ status: false, error: 'Original price must be greater than 0' });
    }

    if (updates.discountedPrice) {
      if (updates.discountedPrice < 0) {
        return res.status(400).json({ status: false, error: 'Discounted price must not be smaller than 0' });
      }
      if (
        (updates.originalPrice && updates.discountedPrice >= updates.originalPrice) ||
        (!updates.originalPrice && updates.discountedPrice >= (await product.findById(id)).originalPrice)
      ) {
        return res.status(400).json({ status: false, error: 'Discounted price must be less than original price' });
      }
    }

    if (updates.thumbnail && typeof updates.thumbnail !== 'string') {
      return res.status(400).json({ status: false, error: 'Thumbnail must be a valid image URL' });
    }

    if (updates.images) {
      if (!Array.isArray(updates.images)) {
        return res.status(400).json({ status: false, error: 'Images must be an array of URLs' });
      }
      if (updates.images.length < 1 || updates.images.length > 5) {
        return res.status(400).json({ status: false, error: 'Images must contain 1 to 5 URLs' });
      }
    }

    if (updates.colors && (!Array.isArray(updates.colors) || updates.colors.length === 0)) {
      return res.status(400).json({ status: false, error: 'Colors must be a non-empty array' });
    }

    if (updates.sizes && !Array.isArray(updates.sizes)) {
      return res.status(400).json({ status: false, error: 'Sizes must be an array' });
    }

    if (updates.description && (!Array.isArray(updates.description) || updates.description.length === 0)) {
      return res.status(400).json({ status: false, error: 'Description must be a non-empty array' });
    }

    if (updates.story && updates.story.length < 20) {
      return res.status(400).json({ status: false, error: 'Story must be at least 20 characters' });
    }

    const updatedProduct = await product.findByIdAndUpdate(
      id,
      { $set: updates },
      {
        new: true,
        runValidators: true,
        context: 'query', // necessary for pre-update hook to work correctly
      }
    );

    if (!updatedProduct) {
      return res.status(404).json({ status: false, error: 'Product not found' });
    }

    return res.status(200).json({
      status: true,
      message: 'Product updated successfully',
      product: updatedProduct,
    });
  } catch (error) {
    console.error('Update product error:', error);
    return res.status(500).json({ status: false, error: error.message });
  }
};

module.exports = updateProduct;