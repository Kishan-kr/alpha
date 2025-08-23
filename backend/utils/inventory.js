const mongoose = require("mongoose");

// Lazy require to avoid circular deps if any
let Product;
try { Product = require("../models/product"); } catch { /* app may name it differently */ }

/**
 * Adjust inventory by delta (+ to restock, - to reserve)
 * Best effort across common shapes: product-level or variants[].
 */
async function adjustStock({ productId, variantId, size, color, delta }) {
  if (!Product || !mongoose.Types.ObjectId.isValid(productId) || !delta) return;

  // Variant first
  if (variantId && mongoose.Types.ObjectId.isValid(variantId)) {
    await Product.updateOne(
      { _id: productId, "variants._id": variantId },
      { $inc: { "variants.$.stock": delta } }
    ).exec();
    return;
  }

  // Fallback by size/color (if you index variants by attributes)
  const tryAttrs = await Product.updateOne(
    { _id: productId, "variants.size": size, "variants.color": color },
    { $inc: { "variants.$.stock": delta } }
  ).exec();
  if (tryAttrs?.modifiedCount) return;

  // Fallback: product-level stock
  await Product.updateOne({ _id: productId }, { $inc: { stock: delta } }).exec();
}

module.exports = { adjustStock };