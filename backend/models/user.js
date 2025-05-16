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
        number: {
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
                area: {
                    type: String,
                },
                houseNo: {
                    type: String,
                },
                landmark: {
                    type: String
                },
                addressType: {
                    type: String,
                    enum: ['Home', 'Office'],
                },
            }
        ]
    },
    {
        timestamps: true
    }
)

const user = mongoose.model("USER", userSchema)
module.exports = user