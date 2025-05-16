const Admin = require("../../models/admin")

const removeAdmin = async(req,res)=>{
    try {        
        const deleteAdminById = await Admin.findByIdAndDelete(req.params.id)
        if(!deleteAdminById){
            throw new Error(`standardAdmin not found with id ${req.params.id}`)
        }
        return res.status(200).json({status:true , deletedAdminId:deleteAdminById._id , msg:`standardAdminbdeleted successfully`})
    } catch (error) {
        return res.status(500).json({ status: false, error: error.message })
    }
}

module.exports = removeAdmin