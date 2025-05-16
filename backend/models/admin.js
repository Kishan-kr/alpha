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
        enum: ['superAdmin', 'standardAdmin']
    },
    password:{
        type:String,
        required:true
    }
})

const admin = mongoose.model("ADMIN" , adminSchema)
module.exports=admin