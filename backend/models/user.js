const mongoose = require("mongoose")
const addressSchema = require("./address")

const userSchema = mongoose.Schema(
    {
        firstName: {
            type: String
        },
        lastName: {
            type: String
        },
        email: {
            type: String,
        },
        phone: {
            type: String,
        },
        gender: {
            type: String,
            enum: ['male', 'female', 'other']
        },

        addresses: [addressSchema]
    },
    {
        timestamps: true
    }
)

const user = mongoose.model("USER", userSchema)
module.exports = user