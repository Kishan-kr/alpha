const { validationResult } = require("express-validator")
const user = require("../../models/user")

const add_Update_PersonalInfo = async (req, res) => {
    try {        
        if (!req.params.id) {
            throw new Error("User Id not found")
        }
        const result = validationResult(req)
        if (!result.errors.length) {
            const isDuplicateEmail = await user.findOne({ email: req.body.email.toLowerCase() })
            if (!isDuplicateEmail || String(isDuplicateEmail._id) === req.user.id) {
                const updateUserProfile = await user.findByIdAndUpdate(
                    req.params.id,
                    { $set: req.body },
                    { new: true, runValidators: true }
                );
                if (!updateUserProfile) {
                    return res.status(404).json({ status: false, error: 'user not found' });
                }
                return res.status(200).json({
                    message: 'Profile updated successfully',
                    userDetails: updateUserProfile,
                });
            }
            return res.status(409).json({ status: false, error: "Email already exists" })

        }
        const err = result.errors.reduce(function (acc, erritem) {
            return { ...acc, [erritem.path]: erritem.msg }
        }, {})
        return res.status(422).json({ status: false, error: err })
    } catch (error) {
        return res.status(500).json({ status: false, error: error.message })
    }
}

module.exports = add_Update_PersonalInfo