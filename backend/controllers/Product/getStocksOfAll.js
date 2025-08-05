const Product = require("../../models/product");
const { INTERNAL_SERVER_ERROR } = require("../../utilis/constants");

const getStocksOfAll = async (req, res) => {
  try {
    const { products } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: "Invalid payload" });
    }

    const stocks = {};

    for (const item of products) {
      const { productId, size, color = "" } = item;

      const product = await Product.findOne(
        {
          _id: productId,
          "sizes.size": size
        },
        {
          _id: 1,
          sizes: { $elemMatch: { size: size } }
        }
      );

      const key = `${productId}_${size}_${color}`;

      if (product && product.sizes?.length > 0) {
        stocks[key] = { maxStock: product.sizes[0].quantity };
      } else {
        stocks[key] = { maxStock: 0 };
      }
    }

    res.status(200).json({
      message: "Stocks fetched successfully",
      stocks
    });

  } catch (error) {
    console.error("Error fetching stocks:", error);
    return res.status(500).json({
      error: error.message || INTERNAL_SERVER_ERROR
    });
  }
};

module.exports = { getStocksOfAll };