const user = require("../../models/user");
const { INTERNAL_SERVER_ERROR } = require("../../utilis/constants");
const CustomError = require("../../utilis/customError");

const deleteAddress = async (req, res) => {
  try {
    const addressId = req.params.addressId;

    if (!addressId) {
      throw new CustomError("Address ID not provided in request", 400);
    }

    const userDoc = await user.findById(req.user.id);
    if (!userDoc) {
      throw new CustomError("User not found", 404);
    }

    const addressToDelete = userDoc.addresses.find(
      (addr) => addr._id.toString() === addressId
    );
    if (!addressToDelete) {
      throw new CustomError("Address already removed or does not exist", 404);
    }

    const wasDefault = addressToDelete.isDefault;

    // Remove the address
    let result = await user.findOneAndUpdate(
      { _id: req.user.id },
      { $pull: { addresses: { _id: addressId } } },
      { new: true }
    );

    if (!result) {
      throw new CustomError("Failed to delete address", 500);
    }

    // If the deleted address was default and there are still addresses, set first one as default
    if (wasDefault && result.addresses.length > 0) {
      const newDefaultId = result.addresses[0]._id;

      await user.updateOne(
        { _id: req.user.id, "addresses._id": newDefaultId },
        { $set: { "addresses.$.isDefault": true } }
      );

      result.addresses[0].isDefault = true;
    }

    return res.status(200).json({
      status: true,
      message: "Address deleted successfully",
      updatedAddresses: result.addresses,
    });

  } catch (error) {
    const status = error.statusCode || 500;
    return res.status(status).json({
      status: false,
      error: error.message || INTERNAL_SERVER_ERROR,
    });
  }
};

module.exports = deleteAddress;