const Product = require('../../models/product');
const { INTERNAL_SERVER_ERROR } = require('../../utilis/constants');

const addProduct = async (req, res) => {
  try {
    const {
      categoryId,
      images,
      thumbnail,
      originalPrice,
      discountedPrice,
      sizes,
      colors,
      tags,
      description,
      story,
      metaTitle,
      metaDescription,
      metaKeywords
    } = req.body;

    const title = req.body.title?.trim().toLowerCase();
    const adminId = req.admin.id;

    const titleExists = await Product.findOne({ title });

    if (titleExists) {
      return res.status(409).json({ error: 'Another product with this title already exists' });
    }

    // Basic validation (optional if schema already handles this)
    if (!title || !images || !thumbnail || !originalPrice || !sizes || !colors || !description || !story) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create and save product
    const product = new Product({
      title,
      categoryId,
      images,
      thumbnail,
      originalPrice,
      discountedPrice,
      sizes,
      colors,
      tags,
      description,
      story,
      adminId,
      metaTitle,
      metaDescription,
      metaKeywords
    });

    await product.save();
    return res.status(201).json({ message: 'Product added successfully', product });
  } catch (error) {
    console.error('Error adding product:', error.message);
    return res.status(500).json({ error: error.message || INTERNAL_SERVER_ERROR });
  }
};

module.exports = addProduct;