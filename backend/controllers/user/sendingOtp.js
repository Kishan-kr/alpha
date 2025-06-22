const { validationResult } = require("express-validator")
const otp = require("../../models/otp")

const sendingOtp = async (req, res) => {
    try {
        const result = validationResult(req)
        if (result.errors.length) {
            const err = result.errors.reduce(function (acc, erritem) {
                return { ...acc, [erritem.path]: erritem.msg }
            }, {})
            return res.status(422).json({ status: false, error: err })
        }
        const newotp = new otp({number:req.body.number , otp:123456})
        const saveotp = await newotp.save()
        if(saveotp){
            return res.status(200).json({message:"OTP sent"})
        }
    } catch (error) {
        return res.status(500).json({ status: false, error: error.message })
    }
}

module.exports = sendingOtp