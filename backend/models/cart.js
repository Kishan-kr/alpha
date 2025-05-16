const mongoose = require("mongoose")

const cartSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "USER"
        },
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "PRODUCT"
        },
        quantity:{
            type:Number,
            required:true
        },
        size:{
            type:String,
            required:true
        },
        color:{
            type:String,
            required:true
        }
    },
    {
        timeStamps: true
    }
)

const cart = mongoose.model("CART", cartSchema)
module.exports = cart