const product = require("../../models/product")

const deleteProduct = async(req,res)=>{
    try {
        if(!req.params.id){
            throw new Error("Invalid Product id")
        }
        const deleteProductById = await product.findByIdAndDelete(req.params.id)
        if(!deleteProductById){
            throw new Error(`Error occured while deleting Product with Id ${req.params.id}`)
        }
        return res.status(200).json({status:true , deletedItemId:deleteProductById._id , msg:"Product Deleted Successfully"})
    } catch (error) {
        return res.status(500).json({atatus:false , error:error.message})
    }
}

module.exports= deleteProduct