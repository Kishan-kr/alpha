const Admin = require("../../models/admin")

const getAdminDetails = async (req, res) => {
    try {        
        if(!req.admin.id){
            throw new Error("AdminId not found")
        }
        const fetchAdminByAminID = await Admin.findById({_id:req.admin.id}).select("-password")
        if(!fetchAdminByAminID){
             throw new Error("Admin not found")
        }
        return res.status(200).json({status:true , adminDetails:fetchAdminByAminID})
    } catch (error) {
        return res.status(500).json({ status: false, error: error.message })
    }
}

module.exports = getAdminDetails