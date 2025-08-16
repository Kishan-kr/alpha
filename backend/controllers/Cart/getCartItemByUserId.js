const { default: mongoose } = require('mongoose');
const Cart = require('../../models/cart');

const getCartItemsByUserId = async (req, res) => {
  try {
    const userId = req.user?.id;

    const cartItems = await Cart.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },

      // Join with products
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "product"
        }
      },
      { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } },

      // Join with categories
      {
        $lookup: {
          from: "categories",
          localField: "product.categoryId",
          foreignField: "_id",
          as: "category"
        }
      },
      { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },

      // Flatten fields
      {
        $project: {
          _id: 1,
          quantity: 1,
          size: 1,
          color: 1,
          productId: "$product._id",
          title: "$product.title",
          thumbnail: "$product.thumbnail",
          originalPrice: "$product.originalPrice",
          discountedPrice: "$product.discountedPrice",
          effectivePrice: "$product.effectivePrice",
          categoryId: "$category._id",
          categoryName: "$category.name",
          variantId: {
            $concat: [
              { $toString: "$product._id" }, "_",
              "$size", "_",
              { $ifNull: ["$color", ""] }
            ]
          }
        }
      }
    ]);

    return res.status(200).json({
      status: true,
      cartItems
    });

  } catch (error) {
    console.error("Aggregation error:", error.message);
    return res.status(500).json({
      status: false,
      error: error.message || "Failed to fetch cart items"
    });
  }
};

module.exports = getCartItemsByUserId;