const user = require("../../models/user")

const getUser = async(req,res)=>{
   try {        
        if(!req.user.id){
            throw new Error("UserId not found")
        }
        const fetchUserByID = await user.findById({_id:req.user.id}).select("-createdAt -updatedAt")
        if(!fetchUserByID){
             throw new Error("user not found")
        }
        return res.status(200).json({status:true , userDetails:fetchUserByID})
    } catch (error) {
        return res.status(500).json({ status: false, error: error.message })
    }
}

module.exports = getUser