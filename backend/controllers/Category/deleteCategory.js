const category = require("../../models/category")

const deleteCategory = async(req,res)=>{
    try {
        if(!req.params.id){
            throw new Error(`Category ID not found ${req.params.id}`)
        }
        const deleteCategoryById = await category.findByIdAndDelete(req.params.id)        
        if(!deleteCategoryById){
            throw new Error(`Category not found with Id ${req.params.id}`)
        }
        return res.status(200).json({status:true , msg:"Category Deleted" , deletedCategoryId:deleteCategoryById._id})
    } catch (error) {
        return res.status(500).json({ status: false, error: error.message })
    }
}


module.exports=deleteCategory