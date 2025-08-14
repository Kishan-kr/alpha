const express = require("express")
const { body } = require("express-validator")
const sendPhoneOtp = require("../controllers/user/sendPhoneOtp")
const validatePhone = require("../controllers/user/validatePhone")
const updatePersonalInfo = require("../controllers/user/updatePersonalInfo")
const authenticateUser = require("../middlwares/authenticateUser")
const getUser = require("../controllers/user/getUser")
const addUserAddress = require("../controllers/user/addUserAddress")
const updateAllAddresses = require("../controllers/user/updateAllAddresses")
const updateAddressById = require("../controllers/user/updateAddressById")
const deleteAddress = require("../controllers/user/deleteAddress")
const deleteUser = require("../controllers/user/deleteUser")
const checkDefaultAddress = require("../middlwares/checkDefaultAddress")
const sendEmailOtp = require("../controllers/user/sendEmailOtp")
const validateEmail = require("../controllers/user/validateEmail")
const logout = require("../controllers/user/logout")
const router = express.Router()

// Auth 
// POST /api/users/auth/send-otp        → Send OTP to mobile number
router.post("/auth/send-otp", [
  body("phone").matches(/^[6-9]\d{9}$/).withMessage("Enter a valid Mobile Number")
], sendPhoneOtp);

// POST /api/users/auth/validate-otp    → Validate OTP
router.post("/auth/validate-otp", validatePhone);

// POST /api/users/auth/logout    → Logout
router.post("/auth/logout", logout);


// Email updation 
// POST /api/users/me/email/send-otp    Get email OTP
router.post(
    '/me/email/send-otp',
    authenticateUser,
    body('email')
        .isEmail().withMessage('Invalid email address')
        .normalizeEmail(),
    sendEmailOtp
);

// POST /api/users/me/email/validate-otp    → Validate OTP
router.post("/me/email/validate-otp",
     body('email')
        .isEmail().withMessage('Invalid email address')
        .normalizeEmail(),
     authenticateUser, 
     validateEmail
);


// GET /api/users/me           → Get logged-in user's details
router.get("/me", authenticateUser, getUser);

// PATCH /api/users/me         → Add or update name and gender for logged-in user
router.patch("/me", authenticateUser, updatePersonalInfo)


// POST /api/users/me/addresses         → Add new address for logged-in user
router.post("/me/addresses", authenticateUser,
     [
          body('pincode')
               .isLength({ min: 6, max: 6 }).withMessage('Pincode must be exactly 6 digits')
               .isNumeric().withMessage('Pincode must contain only numbers'),

          // Required string fields
          body("fullName").notEmpty().withMessage("Please fill in the required fields"),

          body('phone')
               .notEmpty().withMessage('Phone number is required')
               .isLength({ min: 10, max: 10 }).withMessage('Phone number must be exactly 10 digits')
               .isNumeric().withMessage('Phone number must contain only numbers'),


          body('state')
               .notEmpty().withMessage('Please fill in the required fields'),

          body('city')
               .notEmpty().withMessage('Please fill in the required fields'),

          body('line1')
               .notEmpty().withMessage('Please fill in the required fields'),
          body('line2')
               .notEmpty().withMessage('Please fill in the required fields'),
     ], checkDefaultAddress, addUserAddress)


// PATCH /api/users/me/addresses       → Replace all addresses at once
router.patch(
  "/me/addresses",
  authenticateUser,
  [
    body().isArray({ min: 1 }).withMessage("Addresses must be an array"),
    body("*.pincode")
      .isLength({ min: 6, max: 6 }).withMessage("Pincode must be exactly 6 digits")
      .isNumeric().withMessage("Pincode must contain only numbers"),
    body("*.state").notEmpty().withMessage("Please fill in the state"),
    body("*.city").notEmpty().withMessage("Please fill in the city"),
    body("*.line1").notEmpty().withMessage("Line 1 is required")
  ],
  updateAllAddresses
);


// PATCH /api/users/me/addresses        → UPDATE address for logged-in user
router.patch("/me/addresses/:addressId", authenticateUser,
     [
          body('pincode')
               .isLength({ min: 6, max: 6 }).withMessage('Pincode must be exactly 6 digits')
               .isNumeric().withMessage('Pincode must contain only numbers'),

          // Required string fields
          body("fullName").notEmpty().withMessage("Please fill in the required fields"),

          body('phone')
               .notEmpty().withMessage('Phone number is required')
               .isLength({ min: 10, max: 10 }).withMessage('Phone number must be exactly 10 digits')
               .isNumeric().withMessage('Phone number must contain only numbers'),

          body('state')
               .notEmpty().withMessage('Please fill in the required fields'),

          body('city')
               .notEmpty().withMessage('Please fill in the required fields'),

          body('line1')
               .notEmpty().withMessage('Please fill in the required fields'),
          body('line2')
               .notEmpty().withMessage('Please fill in the required fields'),
     ], checkDefaultAddress, updateAddressById)


// DELETE /api/users/me/addresses/:addressId       → Delete a specific address
router.delete("/me/addresses/:addressId", authenticateUser, deleteAddress)

// DELETE /api/users/me         → Delete logged-in user's account
router.delete("/me", authenticateUser, deleteUser)

module.exports = router