const Admin = require("../../models/admin");
const { INTERNAL_SERVER_ERROR } = require("../../utils/constants");
const CustomError = require("../../utils/customError")

const getAdminDetails = async (req, res) => {
    try {
        if (!req.admin.id) {
            throw new CustomError("Unauthorized request", 401);
        }
        const fetchAdminByAminID = await Admin.findById(req.admin.id).select("-password")
        if (!fetchAdminByAminID) {
            throw new CustomError("Admin not found", 404);
        }
        return res.status(200).json({ status: true, admin: fetchAdminByAminID })
    } catch (error) {
        const status = error.statusCode || 500;
        return res.status(status).json({
            status: false,
            error: error.message || INTERNAL_SERVER_ERROR
        });
    }
}

module.exports = getAdminDetails