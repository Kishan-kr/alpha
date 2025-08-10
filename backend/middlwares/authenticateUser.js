// middleware/authenticateUser.js
const User = require("../models/user");

const authenticateUser = async (req, res, next) => {
    try {
        // Check if session exists and has userId
        if (!req.session || !req.session.userId) {
            throw new Error("Unauthorized request! No active session.");
        }

        // Optionally fetch the user from DB to validate existence
        const currentUser = await User.findById(req.session.userId).select("_id");
        if (!currentUser) {
            throw new Error("Unauthorized request! User not found.");
        }

        // Mimic old JWT middleware behavior
        req.user = { id: currentUser._id.toString() };

        next();
    } catch (error) {
        return res.status(401).json({ status: false, error: error.message });
    }
};

module.exports = authenticateUser;