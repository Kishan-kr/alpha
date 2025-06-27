const { validationResult } = require("express-validator");
const user = require("../../models/user");
const CustomError = require("../../utilis/customError");
const { INTERNAL_SERVER_ERROR } = require("../../utilis/constants");

const addUserAddress = async (req, res) => {
    try {
        // Handle validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ status: false, error: errors.array()[0]?.msg });
        }

        const addressData = {
            ...req.body,
            isDefault: req.isDefault || false
        };

        const updatedUser = await user.findOneAndUpdate(
            { _id: req.user.id },
            { $push: { addresses: addressData } },
            { new: true, lean: true }
        );

        if (!updatedUser) {
            throw new CustomError('User not found or address not added', 404);
        }

        const latestAddress = updatedUser.addresses.at(-1); // last pushed address

        return res.status(200).json({
            status: true,
            message: 'Address added successfully',
            address: latestAddress
        });

    } catch (error) {
        const status = error.statusCode || 500;
        return res.status(status).json({
            status: false,
            error: error.message || INTERNAL_SERVER_ERROR
        })
    }
};

module.exports = addUserAddress;