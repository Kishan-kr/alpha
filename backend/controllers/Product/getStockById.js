const Product = require("../../models/product");
const { INTERNAL_SERVER_ERROR } = require("../../utils/constants");

const getStockById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id).select('sizes');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({
    message: "Stock fetched successfully",
    product
  });

} catch (error) {
  console.error("Error fetching stock:", error);
  return res.status(500).json({
    error: error.message || INTERNAL_SERVER_ERROR
  });
}
};

module.exports = { getStockById };