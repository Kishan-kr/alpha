const otp = require("../../models/otp")
const user = require("../../models/user")
const jwt = require("jsonwebtoken")

const validateOtp = async (req, res) => {
    try {
        const isNumberValid = await otp.findOne({ number: req.body.number })
        if (!isNumberValid) {
            throw new Number("Something went wrong")
        }
        if (isNumberValid.otp !== req.body.otp) {
            return res.status(401).json({ status: false, msg: "Invalid OTP" })
        }
        //check user exists or not 
        //if not then we will register a new user with their number and generate token for authentication
        //if user exists already then will only generate a token for authentication
        const isUserExists = await user.findOne({ number: isNumberValid.number })
        if (!isUserExists) {
            const newUser = new user({ phone:isNumberValid.number })
            const saveUser = await newUser.save()
            if (!saveUser) {
                throw new Error("Error occured while creating new user")
            }
            const userToken = jwt.sign({ id: saveUser._id }, process.env.JWT_SECRET, { expiresIn: "1d" })
            if (!userToken) {
                throw new Error("Error occured while generating token for user")
            }
            return res.status(200).json({ status: true, token: userToken })
        }
        const userToken = jwt.sign({ id: isUserExists._id }, process.env.JWT_SECRET, { expiresIn: "1d" })
        if (!userToken) {
            throw new Error("Error occured while generating token for user")
        }
        return res.status(200).json({ status: true, token: userToken })
    } catch (error) {
        return res.status(500).json({ status: false, error: error.message })
    }
}


module.exports = validateOtp