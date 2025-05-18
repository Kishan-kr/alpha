const Admin = require("../models/admin");

const checkAdminRole = async (req, res, next) => {
    try {        
        if(!req.admin || !req.admin.id){
            throw new Error("AdminId not found")
        }
        const fetchAdminById = await Admin.findById({_id:req.admin.id})
        if(!fetchAdminById){
            return res.status(404).json({status:false , error:`Admin not found with id ${req.admin.id}`})
        }
        if(fetchAdminById.role!=="superAdmin"){
            throw new Error("Permission Denied")
        }
        next()
    } catch (error) {
        return res.status(500).json({ status: false, error: error.message })
    }
}


module.exports = checkAdminRole