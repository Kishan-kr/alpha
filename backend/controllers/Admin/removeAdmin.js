const Admin = require("../../models/admin")
const { INTERNAL_SERVER_ERROR } = require("../../utilis/constants")
const CustomError = require("../../utilis/customError")

const removeAdmin = async (req, res) => {
    try {
        const adminId = req.params.id
        const deleteAdminById = await Admin.findByIdAndDelete(adminId)
        if (!deleteAdminById) {
            throw new CustomError(`Admin does not exist or already deleted`, 404);
        }
        return res.status(200).json({ status: true, deletedAdminId: deleteAdminById._id, message: `Admin deleted successfully` })
    } catch (error) {
        const status = error.statusCode || 500;
        return res.status(status).json({
            status: false,
            error: error.message || INTERNAL_SERVER_ERROR
        });
    }
}

module.exports = removeAdmin