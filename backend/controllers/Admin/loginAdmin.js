const Admin = require("../../models/admin")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const loginAdmin = async (req, res) => {
    try {
        const isEmailRegistered = await Admin.findOne({ email: req.body.email })
        if (!isEmailRegistered) {
            return res.status(401).json({ status: false, error: "Invalid Credentails" })
        }
        const checkPassword = await bcrypt.compare(req.body.password , isEmailRegistered.password)        
        if(!checkPassword){
            return res.status(401).json({ status: false, error: "Invalid Credentails" })
        }
        const adminToken = jwt.sign({id:isEmailRegistered._id }, process.env.JWT_SECRET , {expiresIn:"1d"})
        if(!adminToken){
            throw new Error("Error occured while generating token")
        }
        return res.status(200).json({ status: true , msg:"Login Successfull" , token:adminToken })
    } catch (error) {
        return res.status(500).json({ status: false, error: error.message })
    }
}

module.exports = loginAdmin