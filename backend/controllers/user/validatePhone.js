const { validationResult } = require("express-validator")
const otp = require("../../models/otp")
const user = require("../../models/user")
const jwt = require("jsonwebtoken")
const CustomError = require("../../utilis/customError")
const { SESSION_EXPIRATION_TIME, INTERNAL_SERVER_ERROR } = require("../../utilis/constants")

const validatePhone = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ status: false, error: errors.array()[0] });
        }

        const isNumberValid = await otp.findOne({ phoneOrEmail: req.body.phone }).sort({ createdAt: -1 });
        if (!isNumberValid) {
            throw new CustomError("OTP has expired")
        }
        if (isNumberValid.otp !== req.body.otp) {
            throw new CustomError("Invalid OTP", 401)
        }

        // Check if user exists, register if not, then generate token for authentication
        const existingUser = await user.findOne({ phone: isNumberValid.phoneOrEmail });

        let currentUser = existingUser;
        if (!existingUser) {
            currentUser = new user({ phone: isNumberValid.phoneOrEmail });
            await currentUser.save().catch(() => {
                throw new CustomError("Error occurred while creating new user");
            });
        }

        const token = jwt.sign({ id: currentUser._id }, process.env.JWT_SECRET, { expiresIn: SESSION_EXPIRATION_TIME });

        if (!token) {
            throw new CustomError("Error occurred while generating token for user");
        }

        return res.status(200).json({ status: true, user: currentUser, token });

    } catch (error) {
        const status = error.statusCode || 500;
        return res.status(status).json({ status: false, error: error.message || INTERNAL_SERVER_ERROR });
    }
}


module.exports = validatePhone