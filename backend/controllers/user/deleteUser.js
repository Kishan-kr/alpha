const user = require("../../models/user");

const deleteUser = async (req, res) => {
    try {
        if (!req.params.id) {
            throw new Error("User ID not provided");
        }
        const deleteUserById = await user.findByIdAndDelete(req.params.id)
        if (!deleteUserById) {
            return res.status(404).json({ status: false, error: "User not found" });
        }
        return res.status(200).json({status:true , msg:"User deleted Successfully" , deletedUserId:deleteUserById._id})
    } catch (error) {
        return res.status(500).json({ status: false, error: error.message })
    }
}

module.exports = deleteUser