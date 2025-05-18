const admin = require("../models/admin")

const isRoleExists = async(req,res,next)=>{
    try {
        const isRoleExists = await admin.findById(req.admin.id)
        if(!isRoleExists){
            return res.status(404).json({status:false , msg:`Admin not found with Id ${req.admin.id}`})
        }
        next()
    } catch (error) {
        return res.status(500).json({ status: false, error: error.message })
    }
}

module.exports=isRoleExists