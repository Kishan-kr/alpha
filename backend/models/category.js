const mongoose = require("mongoose")

const categorySchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        slug: {
            type: String,
            required: true
        },
        description: String,
        thumbnail: String
    },
    {
        timeStamps: true
    }
)


const category = mongoose.model("CATEGORY" , categorySchema)
module.exports = category