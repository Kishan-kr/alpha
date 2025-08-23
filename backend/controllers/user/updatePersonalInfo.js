const { validationResult } = require("express-validator")
const user = require("../../models/user");
const CustomError = require("../../utils/customError");
const { INTERNAL_SERVER_ERROR } = require("../../utils/constants");

const updatePersonalInfo = async (req, res) => {
    const userId = req.user.id;

    try {
        if (!userId) {
            throw new CustomError("Invalid action", 403);
        }

        const { firstName, lastName, gender } = req.body;
        const updates = {};

        if (firstName) {
            if (firstName.length < 3) {
                throw new CustomError('First name must be at least 3 characters long', 400);
            }
            updates.firstName = firstName;
        }

        if (lastName) {
            if (lastName.length < 3) {
                throw new CustomError('Last name must be at least 3 characters long', 400);
            }
            updates.lastName = lastName;
        }

        if (gender) {
            updates.gender = gender;
        }

        if (Object.keys(updates).length === 0) {
            throw new CustomError('No valid fields provided for update', 400);
        }

        const updatedUser = await user.findByIdAndUpdate(userId, updates, { new: true });

        if (!updatedUser) {
            throw new CustomError('User not found', 404);
        }

        return res.status(200).json({ status: true, user: updatedUser });

    } catch (error) {
        const status = error.statusCode || 500;
        return res.status(status).json({ status: false, error: error.message || INTERNAL_SERVER_ERROR });
    }
};

module.exports = updatePersonalInfo