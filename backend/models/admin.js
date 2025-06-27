const mongoose = require("mongoose")

const adminSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    role:{
        type:String,
        required:true,
        enum: ['SUPER_ADMIN', 'ADMIN']
    },
    password:{
        type:String,
        required:true
    }
})

const admin = mongoose.model("ADMIN" , adminSchema)
module.exports=admin