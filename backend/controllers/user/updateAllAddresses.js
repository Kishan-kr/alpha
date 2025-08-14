const { validationResult } = require("express-validator");
const User = require('../../models/user');
const CustomError = require("../../utilis/customError");
const { INTERNAL_SERVER_ERROR } = require("../../utilis/constants");

const updateAllAddresses = async (req, res) => {
  try {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      const errors = result.array().reduce((acc, item) => {
        // Group errors by address index and field
        if (!acc[item.path]) acc[item.path] = item.msg;
        return acc;
      }, {});
      return res.status(422).json({ status: false, error: errors });
    }

    const newAddresses = req.body; // Array of addresses

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { addresses: newAddresses } },
      { new: true, lean: true }
    );

    if (!updatedUser) {
      throw new CustomError("User not found", 404);
    }

    return res.status(200).json({
      status: true,
      message: "Addresses updated successfully",
      addresses: updatedUser.addresses
    });

  } catch (error) {
    const status = error.statusCode || 500;
    return res.status(status).json({
      status: false,
      error: error.message || INTERNAL_SERVER_ERROR
    });
  }
};

module.exports = updateAllAddresses;
