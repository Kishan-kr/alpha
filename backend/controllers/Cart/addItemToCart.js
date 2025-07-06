const Cart = require('../../models/cart');
const { INTERNAL_SERVER_ERROR } = require('../../utilis/constants');
const CustomError = require('../../utilis/customError');

const addItemToCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const item = req.body;
    const userId = req.user.id;

    if (!productId) {
      throw new CustomError("Product ID is required", 400);
    }

    if (!item?.size || item?.quantity == null || !item?.color) {
      throw new CustomError("Size, color and quantity are required", 400);
    }

    if (typeof item?.quantity !== 'number' || item?.quantity < 1) {
      throw new CustomError("Quantity must be a number greater than 0", 400);
    }

    const existingItem = await Cart.findOne({ userId, productId, color: item.color, size: item.size });
    if (existingItem) {
      throw new CustomError("Item already exists in cart", 409);
    }

    const newCart = new Cart({ 
      userId, 
      productId, 
      size: item.size, 
      color: item.color, 
      quantity: item.quantity 
    });
    const savedCart = await newCart.save();

    return res.status(201).json({
      status: true,
      message: "Item added to cart successfully",
      cartItem: savedCart
    });

  } catch (error) {
    console.error("Add to cart error:", error.message);
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      status: false,
      error: error.message || INTERNAL_SERVER_ERROR
    });
  }
};

module.exports = addItemToCart;