const product = require('../../models/product');

const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;

    if (!productId) {
      return res.status(400).json({ status: false, error: 'Product ID is required' });
    }

    const foundProduct = await product.findById(productId)
      .populate({
        path: 'categoryId',
        select: 'name -_id',
      })
      .populate({
        path: 'adminId',
        select: '-password',
      });

    if (!foundProduct) {
      return res.status(404).json({ status: false, error: 'Product not found' });
    }

    return res.status(200).json({ status: true, product: foundProduct });
  } catch (error) {
    console.error('Error fetching product:', error);
    return res.status(500).json({ status: false, error: error.message });
  }
};

module.exports = getProductById;