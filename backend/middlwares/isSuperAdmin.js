const Admin = require("../models/admin");
const { INTERNAL_SERVER_ERROR } = require("../utils/constants");
const CustomError = require("../utils/customError");

const isSuperAdmin = async (req, res, next) => {
    try {
        if (!req.admin || !req.admin.id) {
            throw new CustomError("Unauthorized request", 401);
        }
        const { role } = req.admin;
        if (role !== "SUPER_ADMIN") {
            throw new CustomError("Permission Denied", 401)
        }
        next()
    } catch (error) {
        const status = error.statusCode || 500;
        return res.status(status).json({
            status: false,
            error: error.message || INTERNAL_SERVER_ERROR
        });
    }
}


module.exports = isSuperAdmin