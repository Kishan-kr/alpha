const product = require("../../models/product");
const { getFileKeyFromUrl, deleteMultipleFromR2 } = require("../../services/configR2");

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ status: false, error: 'Invalid product ID' });
    }

    // Step 1: Find the product first
    const productToDelete = await product.findById(id);

    if (!productToDelete) {
      return res.status(404).json({ status: false, error: `No product found with ID ${id}` });
    }

    // Step 2: Extract all R2 keys (images + thumbnail)
    const imageKeys = [
      ...productToDelete.images.map(getFileKeyFromUrl),
      getFileKeyFromUrl(productToDelete.thumbnail)
    ].filter(Boolean); // remove nulls

    // Step 3: Delete files from R2
    const { deleted, errors } = await deleteMultipleFromR2(imageKeys);

    // Step 4: Delete product from DB
    const deletedProduct = await product.findByIdAndDelete(id);

    return res.status(200).json({
      status: true,
      deletedItemId: deletedProduct._id,
      deletedFiles: deleted,
      failedToDelete: errors,
      message: 'Product and images deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return res.status(500).json({ status: false, error: error.message });
  }
};

module.exports = deleteProduct