const mongoose = require("mongoose")

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

        addresses: [
            {
                country: {
                    type: String,
                    enum: ['India'], // Restricts to only "India"
                    default: "India"
                },
                city: {
                    type: String
                },
                state: {
                    type: String,
                },
                pincode: {
                    type: String,
                },
                line1: {
                    type: String,
                },
                line2: {
                    type: String,
                },
                landmark: {
                    type: String
                },
                addressType: {
                    type: String,
                    enum: ['Home', 'Office'],
                },
                isDefault:{
                    type:Boolean,
                    default:false
                }
            }
        ]
    },
    {
        timestamps: true
    }
)

const user = mongoose.model("USER", userSchema)
module.exports = user