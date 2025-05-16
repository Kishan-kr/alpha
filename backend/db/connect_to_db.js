const mongooose = require("mongoose")
const adminfunc = require("../utilis/admincheck")
const admin = require("../models/admin")


const connect = async()=>{
    try {
        const connection = await mongooose.connect(process.env.MONGODB_URL)
        if(connection){
            console.log("Successfully connected to database");
            adminfunc()
            //  console.log(await admin.find());
            
        }
    } catch (error) {
        console.log(error);
        
    }
}

module.exports=connect