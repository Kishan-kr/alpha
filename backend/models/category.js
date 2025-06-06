const mongoose = require("mongoose")

const categorySchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description:{
            type:String,
            required:true
        }
    },
    {
        timeStamps: true
    }
)


const category = mongoose.model("CATEGORY" , categorySchema)
module.exports = category