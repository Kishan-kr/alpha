const User = require("../models/user");
const { INTERNAL_SERVER_ERROR } = require("../utilis/constants");
const CustomError = require("../utilis/customError");

const checkDefaultAddress = async (req, res , next) => {
    try {
        const userId = req.user.id;

        if (!userId) {
            throw new CustomError("Invalid Action", 403)
        }
        const foundUser = await User.findById({ _id: userId })
        if (!foundUser) {
            throw new CustomError("User not found", 400)
        }
        else if (foundUser.addresses?.length === 0) {
            req.isDefault = true
        }
        else if (req.body.isDefault) {
            await User.updateOne(
                { _id: userId },
                { $set: { "addresses.$[].isDefault": false } }
            );
            req.isDefault = true
        }
        else{
            req.isDefault = false
        }
        next()
    } catch (error) {
        const status = error.statusCode || 500;
        return res.status(status).json({ 
            status: false, 
            error: error.message || INTERNAL_SERVER_ERROR
        })
    }
}

module.exports = checkDefaultAddress