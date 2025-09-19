const Cart = require("../models/cart");

/**
 * Clears all items from the user's cart.
 * @param {string|ObjectId} userId - The user's ID
 * @returns {Promise<void>}
 */
async function clearUserCart(userId) {
  if (!userId) return;
  try {
    await Cart.deleteMany({ userId });
  } catch (err) {
    console.error("Error clearing user cart:", err.message);
    throw err;
  }
}

module.exports = { clearUserCart };