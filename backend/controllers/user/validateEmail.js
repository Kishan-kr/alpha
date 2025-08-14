const { validationResult } = require("express-validator")
const otp = require("../../models/otp")
const user = require("../../models/user")
const CustomError = require("../../utilis/customError")
const { INTERNAL_SERVER_ERROR } = require("../../utilis/constants")

const validateEmail = async (req, res) => {
  const userId = req.user.id;
  const email = req.body.email;

  try {
    // Handle validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: false, error: errors.array()[0]?.msg });
    }

    const isEmailValid = await otp.findOne({ phoneOrEmail: email }).sort({ createdAt: -1 });
    if (!isEmailValid) {
      throw new CustomError("Code has expired", 404)
    }
    if (isEmailValid.otp !== req.body.otp) {
      throw new CustomError("Invalid Code", 401)
    }

    // Check if user exists, register if not, then generate token for authentication
    const updatedUser = await user.findByIdAndUpdate(userId, { email }, { new: true });

    if (!updatedUser) {
      throw new CustomError("Unable to update email");
    }

    return res.status(200).json({ status: true, user: updatedUser });

  } catch (error) {
    const status = error.statusCode || 500;
    return res.status(status).json({ status: false, error: error.message || INTERNAL_SERVER_ERROR });
  }
}


module.exports = validateEmail