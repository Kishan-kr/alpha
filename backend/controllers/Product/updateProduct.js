const product = require("../../models/product");

const updateProduct = async(req,res)=>{
    try {
        if(!req.params.id){
            throw new Error("Invalid Product id")
        }
        const updatedProduct = await product.findByIdAndUpdate(
          req.params.id,
          { $set: req.body },
          { new: true, runValidators: true }
        );
        if (!updatedProduct) {
          return res.status(404).json({status:false ,  error: 'Product not found' });
        }
        return res.status(200).json({
          message: 'Product updated successfully',
          product: updatedProduct,
        });
      } catch (error) {
        res.status(500).json({status:false, error: error.message });
      }
}

module.exports = updateProduct