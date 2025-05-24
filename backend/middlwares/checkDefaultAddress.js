const user = require("../models/user")

const checkDefaultAddress = async (req, res , next) => {
    try {
        if (!req.params.userId || !req.user.id) {
            throw new Error("User Id not found")
        }
        if (req.user.id !== req.params.userId) {
            throw new Error("Invalid Action")
        }
        const getUserById = await user.findById({ _id: req.user.id })
        if (!getUserById) {
            throw new Error("User not found")
        }
        else if (!getUserById.addresses.length) {
            req.isDefault = true
            next()
        }
        else if (req.body.isDefault) {
            await user.updateOne(
                { _id: req.user.id },
                { $set: { "addresses.$[].isDefault": false } }
            );
            req.isDefault=true
            next()
        }
        else{
            req.isDefault=false
            next()
        }
    } catch (error) {
        return res.status(500).json({ status: false, error: error.message })
    }
}

module.exports = checkDefaultAddress