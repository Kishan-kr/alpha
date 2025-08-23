const user = require("../../models/user");
const { INTERNAL_SERVER_ERROR } = require("../../utils/constants");
const CustomError = require("../../utils/customError");

const deleteUser = async (req, res) => {
    try {
        if (!req.user.id) {
            throw new CustomError("User ID not provided", 400);
        }
        const deleteUserById = await user.findByIdAndDelete(req.user.id)
        if (!deleteUserById) {
            throw new CustomError("User not found", 404);
        }
        return res.status(200).json({status:true , message:"User deleted Successfully" , deletedUserId:deleteUserById._id})
    } catch (error) {
        const status = error.statusCode || 500;
        return res.status(status).json({ 
            status: false, 
            error: error.message || INTERNAL_SERVER_ERROR
        })
    }
}

module.exports = deleteUser