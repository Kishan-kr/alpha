const mongoose = require("mongoose")
const { countries } = require("../utilis/enums")
const addressSchema = require("./address")

const extendedAddressSchema = new mongoose.Schema({
    ...addressSchema.obj,
    label: {type: String, enum: ['home', 'office', 'other']},
    isDefault: {type: Boolean, default: false}
});

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

        addresses: [extendedAddressSchema]
    },
    {
        timestamps: true
    }
)

const user = mongoose.model("USER", userSchema)
module.exports = user