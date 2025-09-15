const mongoose = require("mongoose")

const orderTokenSchema = mongoose.Schema({
    token: {
        type:String,
        required: true
    },
    orderId: {
        type: String
    },
    used: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 3600 // 1 hour in seconds
    }
})

const OrderToken = mongoose.model("OrderToken" , orderTokenSchema)
module.exports = OrderToken;