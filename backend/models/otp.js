const mongoose = require("mongoose")

const otpSchema = mongoose.Schema({
    number: {
        type:String,
        required:true
    },
    otp: {
        type: String,
        required:true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300 // 5 minutes in seconds
    }
})

const otp = mongoose.model("OTP" , otpSchema)
module.exports=otp