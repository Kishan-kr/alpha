const Product = require('../../models/product');

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
    } = req.body;

    const title = req.body.title?.toLowerCase();
    const adminId = req.admin.id;

    const titleExists = await Product.findOne({title});

    if (titleExists) {
        return res.status(409).json({ error: 'Product with this title already exists' });
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
    });

    await product.save();
    return res.status(201).json({ message: 'Product added successfully', product });
  } catch (error) {
    console.error('Error adding product:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};

module.exports = addProduct;