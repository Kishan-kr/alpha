const Cart = require('../../models/cart');
const { INTERNAL_SERVER_ERROR } = require('../../utils/constants');
const CustomError = require('../../utils/customError');

const updateCartByCartId = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity, size, color } = req.body;

    if (!itemId) {
      throw new CustomError("Item ID is required", 400);
    }

    const updates = {};

    if (quantity !== undefined) {
      if (typeof quantity !== 'number' || quantity < 1) {
        throw new CustomError("Quantity must be a number greater than 0", 400);
      }
      updates.quantity = quantity;
    }

    if (size) {
      updates.size = size.trim();
    }

    if (color) {
      updates.color = color.trim();
    }

    if (Object.keys(updates).length === 0) {
      throw new CustomError("No valid fields provided for update", 400);
    }

    const updatedCart = await Cart.findByIdAndUpdate(
      itemId,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedCart) {
      throw new CustomError("Cart item not found", 404);
    }

    return res.status(200).json({
      status: true,
      message: "Cart item updated successfully",
      cartItem: updatedCart
    });

  } catch (error) {
    const status = error.statusCode || 500;
    return res.status(status).json({
      status: false,
      error: error.message || INTERNAL_SERVER_ERROR
    });
  }
};

module.exports = updateCartByCartId;