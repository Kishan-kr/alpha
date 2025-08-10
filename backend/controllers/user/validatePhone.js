const { validationResult } = require("express-validator");
const Otp = require("../../models/otp");
const User = require("../../models/user");
const CustomError = require("../../utilis/customError");
const { INTERNAL_SERVER_ERROR } = require("../../utilis/constants");

const validatePhone = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ status: false, error: errors.array()[0] });
        }

        const isNumberValid = await Otp.findOne({ phoneOrEmail: req.body.phone }).sort({ createdAt: -1 });
        if (!isNumberValid) throw new CustomError("OTP has expired");
        if (isNumberValid.otp !== req.body.otp) throw new CustomError("Invalid OTP", 401);

        let currentUser = await User.findOne({ phone: isNumberValid.phoneOrEmail });
        if (!currentUser) {
            let userData = { phone: isNumberValid.phoneOrEmail };
            if (req.body.firstName) userData.firstName = req.body.firstName;
            if (req.body.lastName) userData.lastName = req.body.lastName;

            currentUser = new User(userData);
            await currentUser.save().catch(() => {
                throw new CustomError("Error occurred while creating new user");
            });
        }

        // 🔹 Regenerate session ID before saving user data
        req.session.regenerate((err) => {
            if (err) {
                return res.status(500).json({ status: false, error: "Could not regenerate session" });
            }

            req.session.userId = currentUser._id;

            // Explicitly save session
            req.session.save((err) => {
                if (err) {
                    return res.status(500).json({ status: false, error: "Could not save session" });
                }

                res.status(200).json({ status: true, user: currentUser });
            });
        });

    } catch (error) {
        const status = error.statusCode || 500;
        return res.status(status).json({ status: false, error: error.message || INTERNAL_SERVER_ERROR });
    }
};

module.exports = validatePhone;