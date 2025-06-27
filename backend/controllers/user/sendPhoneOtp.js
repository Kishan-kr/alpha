const { validationResult } = require("express-validator")
const Otp = require('../../models/otp');
const { sendOTPSms } = require("../../services/twoFactor");
const { INTERNAL_SERVER_ERROR } = require("../../utilis/constants");

const sendPhoneOtp = async (req, res) => {
    try {
        // 1. Handle validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ status: false, error: errors.array()[0]?.msg });
        }

        let { phone } = req.body;

        // 2. Generate OTP (example: 6-digit random number)
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // 3. Store OTP in DB
        await Otp.create({ phoneOrEmail: phone, otp });

        // 4. Send OTP via phone
        await sendOTPSms(phone, otp);

        // Placeholder for demonstration
        console.log(`Sending OTP ${otp} to ${phone}`);

        return res.status(200).json({
            status: true,
            message: 'OTP sent successfully'
        });
    } catch (error) {
        const status = error.statusCode || 500;
        return res.status(status).json({ status: false, error: error.message || INTERNAL_SERVER_ERROR });
    }
}

module.exports = sendPhoneOtp