const admin = require("../../models/admin")

const getAllAdmins = async(req,res)=>{
    try {
        return res.status(200).json({status:true , admins:await admin.find().select("-password")})
    } catch (error) {
        return res.status(500).json({status:false , error:error.message})
    }
}

module.exports = getAllAdmins