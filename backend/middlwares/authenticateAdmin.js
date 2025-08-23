const jwt = require("jsonwebtoken");
const CustomError = require("../utils/customError");
const Admin = require("../models/admin");

const authenticateAdmin = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new CustomError('Unauthorized request! Missing or invalid token format.', 401);
        }

        const token = authHeader.split(' ')[1];

        if (!token || token === 'null' || token === 'undefined') {
            throw new CustomError('Unauthorized request! Token is empty or invalid.', 401);
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch admin from DB using ID from token
        const admin = await Admin.findById(decoded.id).select('-password');
        if (!admin) {
            throw new CustomError('Unauthorized! Admin not found.', 401);
        }

        req.admin = admin;
        req.admin.id = admin._id;
        next();
    } catch (error) {
        const status = error.statusCode || 401;
        const message =
            error.name === 'TokenExpiredError' ? 'Session expired!' :
                error.name === 'JsonWebTokenError' ? 'Invalid session!' :
                    error.message || 'Authentication failed.';

        return res.status(status).json({ status: false, error: message });
    }
};

module.exports = authenticateAdmin