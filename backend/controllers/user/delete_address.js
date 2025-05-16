const user = require("../../models/user");

const deleteAddress = async (req, res) => {
    try {
        if (!req.params.id) {
            throw new Error("User ID not provided");
        }

        if (!req.params.addressId) {
            throw new Error("Address ID not provided in request body");
        }
        const result = await user.findOneAndUpdate(
            { _id: req.params.id, "addresses._id": req.params.addressId },
            
            {
                $pull: { addresses: { _id:req.params.addressId  } }
            },
            {
                new: true // return the doc *before* the update so we can extract the deleted address
            }
        );

        if (!result) {
            return res.status(404).json({ status: false, error: "User or address not found", result: result });
        }

        return res.status(200).json({ status: true, UpdatedAddress: result })
        // return res.json({ userId: req.params.id, addressId: req.params.addressId })

    } catch (error) {
        return res.status(500).json({ status: false, error: error.message })
    }
}

module.exports = deleteAddress