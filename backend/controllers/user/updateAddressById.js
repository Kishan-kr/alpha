const { validationResult } = require("express-validator");
const User = require('../../models/user');
const CustomError = require("../../utils/customError");
const { INTERNAL_SERVER_ERROR } = require("../../utils/constants");

const updateAddressById = async (req, res) => {
    const addressId = req.params.addressId;
  try {

    if(!addressId) {
        throw new CustomError('Address id is required', 400);
    }

    const result = validationResult(req);

    if (!result.isEmpty()) {
      const errors = result.array().reduce((acc, item) => {
        acc[item.path] = item.msg;
        return acc;
      }, {});
      return res.status(422).json({ status: false, error: errors });
    }

    const addressData = { ...req.body };

    const updatedUser = await User.findOneAndUpdate(
      { _id: req.user.id, "addresses._id": addressId },
      {
        $set: {
          "addresses.$": {  _id: addressId, ...addressData }
        }
      },
      { new: true, lean: true }
    );

    if (!updatedUser) {
        throw new CustomError('Address not found or already deleted', 404);
    }

    const addresses = updatedUser.addresses;

    return res.status(200).json({
      status: true,
      message: "Address updated successfully",
      addresses,
    });

  } catch (error) {
    const status = error.statusCode || 500;
    return res.status(status).json({
      status: false,
      error: error.message || INTERNAL_SERVER_ERROR
    });
  }
};

module.exports = updateAddressById;