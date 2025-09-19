const mongoose = require("mongoose");

// Lazy require to avoid circular deps if any
let Product;
try { Product = require("../models/product"); } catch { /* app may name it differently */ }

/**
 * Adjust inventory by delta (+ to restock, - to reserve)
 * Best effort across common shapes: product-level or variants[].
 */
async function adjustStock({ productId, size, delta, color }) {
  if (!Product || !mongoose.Types.ObjectId.isValid(productId) || !delta) return;

  // Adjust by size (main inventory logic)
  if (size) {
    const result = await Product.updateOne(
      { _id: productId, "sizes.size": size },
      { $inc: { "sizes.$.quantity": delta } }
    ).exec();
    if (result?.modifiedCount) {
      console.log('Stock adjusted for product', productId, 'size', size, 'by', delta); // debug
      return
    };
  }

  // Fallback: product-level stock (not present in schema, but for legacy)
  // If you want to support a product-level stock, uncomment below:
  // await Product.updateOne({ _id: productId }, { $inc: { stock: delta } }).exec();
}

module.exports = { adjustStock };