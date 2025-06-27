const Cart = require('../../models/cart');
const { INTERNAL_SERVER_ERROR } = require('../../utilis/constants');
const CustomError = require('../../utilis/customError');

const removeAllItemsFromCart = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      throw new CustomError("User ID is missing from the request", 400);
    }

    const result = await Cart.deleteMany({ userId });

    if (result.deletedCount === 0) {
      throw new CustomError("Cart is already empty or no items found", 404);
    }

    return res.status(200).json({
      status: true,
      message: "All items removed from cart successfully",
      removedCount: result.deletedCount
    });

  } catch (error) {
    const status = error.statusCode || 500;
    return res.status(status).json({
      status: false,
      error: error.message || INTERNAL_SERVER_ERROR
    });
  }
};

module.exports = removeAllItemsFromCart;