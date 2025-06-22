const Admin = require("../../models/admin")
const { validationResult } = require("express-validator")
const bcrypt = require("bcryptjs")

const addAdmin = async(req,res)=>{
    try {
        const result = validationResult(req)
        if (!result.errors.length) {
            const duplicateAdminByEmail = await Admin.findOne({ email:req.body.email.toLowerCase() })
            if (duplicateAdminByEmail) {
                return res.status(409).json({ status: false, error: "Email already exists" })
            }
            const newAdmin = new Admin({ ...req.body, email:req.body.email.toLowerCase() , password: await bcrypt.hash(req.body.password, 10) })
            const saveNewAdmin = await newAdmin.save()
            if (saveNewAdmin) {
                return res.status(201).json({ status: true, message: "Admin added Successfully" })
            }
            throw new Error("Error occured while adding newadmin")
        }
        const err = result.errors.reduce(function (acc, erritem) {
            return { ...acc, [erritem.path]: erritem.msg }
        }, {})
        return res.status(422).json({ status: false, error: err })
    } catch (error) {        
        return res.status(500).json({ status: false, error: error.message })

    }
}


module.exports=addAdmin