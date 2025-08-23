const Cart = require('../../models/cart');
const { INTERNAL_SERVER_ERROR } = require('../../utils/constants');
const CustomError = require('../../utils/customError');

const removeCartItemById = async (req, res) => {
  try {
    const { itemId } = req.params;

    if (!itemId) {
      throw new CustomError("Cart ID is required", 400);
    }

    const deletedCartItem = await Cart.findByIdAndDelete(itemId);

    if (!deletedCartItem) {
      throw new CustomError("Cart item doesn't exist or may already have been removed", 404);
    }

    return res.status(200).json({
      status: true,
      message: "Item removed from cart successfully",
      deletedItemId: deletedCartItem._id
    });

  } catch (error) {
    const status = error.statusCode || 500;
    return res.status(status).json({
      status: false,
      error: error.message || INTERNAL_SERVER_ERROR
    });
  }
};

module.exports = removeCartItemById;