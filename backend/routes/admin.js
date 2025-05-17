const express = require("express")
const router = express.Router()
const { body } = require("express-validator")
const addAdmin = require("../controllers/Admin/addAdmin")
const loginAdmin = require("../controllers/Admin/loginAdmin")
const authenticateAdmin = require("../middlwares/authenticateAdmin")
const getAdminDetails = require("../controllers/Admin/getAdminDetails")
const removeAdmin = require("../controllers/Admin/removeAdmin")
const checkAdminRole = require("../middlwares/checkAdminRole")
const getAllAdmins = require("../controllers/Admin/getAllAdmins")


//add admin route
router.post("/create-admin", [
    body("email").matches(`@tashn.in`, 'gi').withMessage("Invalid Email"), body("name").isLength({ min: 3 }).withMessage("Name must have at least 3 characters"), body('password')
        .isLength({ min: 8 }).withMessage('Minimum length of password must be 8')
        .not().isNumeric().withMessage('Password must contain an alphabet')
        .not().isAlpha().withMessage('Password must contain a number')
        .not().isUppercase().withMessage('Password must contain a lowercase letter')
        .not().isLowercase().withMessage('Password must contain a uppercase letter')
], authenticateAdmin, checkAdminRole, addAdmin)

//login admin
router.post("/login-admin" , loginAdmin )

//get admin details
router.get("/admin-details" , authenticateAdmin  , getAdminDetails)


//get all admins
router.get("/all-admins" , authenticateAdmin , checkAdminRole, getAllAdmins)

//delete admin
router.delete("/delete-admin/:id" , authenticateAdmin , checkAdminRole, removeAdmin)


module.exports= router