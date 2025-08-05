const Product = require('../models/product');

/**
 * Verifies each cart item's quantity against current stock in DB.
 * Assumes `req.body.products` is an array of cart items.
 */
const verifyStocks = async (req, res, next) => {
  try {
    const cart = req.body.products;
    if (!Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ error: 'Cart is empty or invalid' });
    }

    const stockErrors = [];

    for (const item of cart) {
      const product = await Product.findById(item.productId).select('sizes title colors');
      if (!product) {
        stockErrors.push(`Product not found: ${item._id}`);
        continue;
      }

      const selectedSize = item.size.toUpperCase();
      const size = product.sizes.find((s) => s.size?.toUpperCase() === selectedSize);
      const availableStock = size.quantity;

      if (item.quantity > availableStock) {
        stockErrors.push(`${product.title} (${selectedSize}) has only ${availableStock} items in stock.`);
      }
    }

    if (stockErrors.length > 0) {
      return res.status(409).json({ errorMessage: 'Stock validation failed', errors: stockErrors });
    }

    next();
  } catch (err) {
    console.error('Stock check failed:', err);
    return res.status(500).json({ error: 'Server error during stock verification' });
  }
};

module.exports = verifyStocks;