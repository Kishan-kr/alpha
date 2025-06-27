const Cart = require('../../models/cart');

const getCartItemsByUserId = async (req, res) => {
  try {
    const userId = req.user?.id;

    const cartItems = await Cart.find({ userId })
      .populate({
        path: "productId",
        select: "title thumbnail originalPrice discountedPrice effectivePrice categoryId",
        populate: {
          path: "categoryId",
          select: "name"
        }
      })
      .select("-userId"); // hides userId in the response

    return res.status(200).json({
      status: true,
      cartItems
    });

  } catch (error) {
    console.error("Get cart items error:", error.message);
    const status = error.statusCode || 500;
    return res.status(status).json({
      status: false,
      error: error.message || "Failed to fetch cart items"
    });
  }
};

module.exports = getCartItemsByUserId;