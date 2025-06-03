const express = require("express")
const { body } = require("express-validator")
const sendingOtp = require("../controllers/user/sendingOtp")
const validateOtp = require("../controllers/user/validateOtp")
const add_Update_PersonalInfo = require("../controllers/user/add_Update_Personalnfo")
const authenticateUser = require("../middlwares/authenticateUser")
const getUser = require("../controllers/user/getUser")
const add_userAddress = require("../controllers/user/add_Address")
const update_Address = require("../controllers/user/update_Address")
const deleteAddress = require("../controllers/user/delete_address")
const deleteUser = require("../controllers/user/deleteUser")
const checkDefaultAddress = require("../middlwares/checkDefaultAddress")
const router = express.Router()


//sending OTP 
router.post("/sending-otp", [
     body("number").matches(/^[6-9]\d{9}$/).withMessage("Enter a valid Mobile Number")
], sendingOtp)


//validating otp
router.post("/validate-otp", [
     body('otp')
         .matches(/^\d{6}$/).withMessage('Enter a valid OTP')
], validateOtp)

//get user details
router.get("/get-User", authenticateUser, getUser)

//adding personal details
router.patch("/personal-info/:id", authenticateUser, [
     body("firstName").isLength({ min: 1 }).withMessage("Required*"),
     body("email").isEmail().withMessage("Invalid Email")
], add_Update_PersonalInfo)


//adding user address
router.patch("/user-address/:userId", authenticateUser,
     [
          body('pincode')
               .isLength({ min: 6, max: 6 }).withMessage('Pincode must be exactly 6 digits')
               .isNumeric().withMessage('Pincode must contain only numbers'),

          // Required string fields
          body("fullName").notEmpty().withMessage("Required*"),

          body('phone')
               .notEmpty().withMessage('Phone number is required')
               .isLength({ min: 10, max: 10 }).withMessage('Phone number must be exactly 10 digits')
               .isNumeric().withMessage('Phone number must contain only numbers'),


          body('state')
               .notEmpty().withMessage('Required*'),

          body('city')
               .notEmpty().withMessage('Required*'),

          body('line1')
               .notEmpty().withMessage('Required*'),
          body('line2')
               .notEmpty().withMessage('Required*'),
     ], checkDefaultAddress, add_userAddress)


//update address
router.put("/update_UserAddress/:userId", authenticateUser,
     [
          body('pincode')
               .isLength({ min: 6, max: 6 }).withMessage('Pincode must be exactly 6 digits')
               .isNumeric().withMessage('Pincode must contain only numbers'),

          // Required string fields
          body("fullName").notEmpty().withMessage("Required*"),

          body('phone')
               .notEmpty().withMessage('Phone number is required')
               .isLength({ min: 10, max: 10 }).withMessage('Phone number must be exactly 10 digits')
               .isNumeric().withMessage('Phone number must contain only numbers'),

          body('state')
               .notEmpty().withMessage('Required*'),

          body('city')
               .notEmpty().withMessage('Required*'),

          body('line1')
               .notEmpty().withMessage('Required*'),
          body('line2')
               .notEmpty().withMessage('Required*'),
     ], checkDefaultAddress, update_Address)


//delete address     
router.delete("/delete_address/:addressId", authenticateUser, deleteAddress)

//delete user
router.delete("/delete_user/:id", authenticateUser, deleteUser)

module.exports = router