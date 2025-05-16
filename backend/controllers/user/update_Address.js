const { validationResult } = require("express-validator");
const user = require("../../models/user");

const update_Address = async (req, res) => {
    try {

        if (!req.params.id) {
            throw new Error("User ID not provided");
        }

        if (!req.body._id) {
            throw new Error("Address ID not provided in request body");
        }
        const result = validationResult(req)
        if (result.errors.length) {
            const err = result.errors.reduce(function (acc, erritem) {
                return { ...acc, [erritem.path]: erritem.msg }
            }, {})
            return res.status(422).json({ status: false, error: err })
        }
        const updatedaddress = await user.findOneAndUpdate(
            { _id: req.params.id, "addresses._id": req.body._id },
            {
                $set: {
                    "addresses.$": req.body
                }
            },
            {
                new: true, // return updated document
                lean: true // plain JS object
            }
        );

        if (!updatedaddress) {
            return res.status(404).json({ status: false, error: "User or address not found", result: updatedaddress });
        }

        return res.status(200).json({ status: true, UpdatedAddress: updatedaddress })

    } catch (error) {
        return res.status(500).json({ status: false, error: error.message })
    }
}

module.exports = update_Address