const { validationResult } = require("express-validator")
const user = require("../../models/user")

const add_userAddress = async (req, res) => {
    try {
        const result = validationResult(req)
        if (!result.errors.length) {
            const updateUserAddress = await user.findOneAndUpdate(
                { _id: req.params.userId },
                { $push: { addresses: {...req.body, isDefault: req.isDefault} } },
                { returnDocument: 'after' } // Use 'after' to get the updated document
            );
            if (!updateUserAddress) {
                return res.status(404).json({ status: false, error: 'Address not updated or added' });
            }
            return res.status(200).json({
                message: 'Address updated successfully',
                userDetails: updateUserAddress.addresses,
            });
        }
        const err = result.errors.reduce(function (acc, erritem) {
            return { ...acc, [erritem.path]: erritem.msg }
        }, {})
        return res.status(422).json({ status: false, error: err })
        
    } catch (error) {
        return res.status(500).json({ status: false, error: error.message })
    }
}

module.exports = add_userAddress