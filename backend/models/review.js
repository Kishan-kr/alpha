const mongoose = require("mongoose")

const reviewSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "USER"
        },
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "PRODUCT"
        },
        rating: {
            type: Number,
            required: true
        },
        comment: {
            type: String,
            required: true
        },
        images: [String]
    },
    {
        timestamps: true
    }
)

const review = mongoose.model("REVIEW", reviewSchema)
module.exports = review