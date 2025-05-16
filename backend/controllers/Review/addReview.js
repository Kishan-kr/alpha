const { validationResult } = require("express-validator")
const review = require("../../models/review")

const addReview = async (req, res) => {
    try {
        if (!req.user.id) {
            throw new Error("User Id not provided")
        }
        if (!req.params.productId) {
            throw new Error("product Id not provided")
        }
        const result = validationResult(req)
        if (result.errors.length) {
            const err = result.errors.reduce(function (acc, erritem) {
                return { ...acc, [erritem.path]: erritem.msg }
            }, {})
            return res.status(422).json({ status: false, error: err })
        }
        const newReview = new review({ ...req.body, productId: req.params.productId, userId: req.user.id })
        const saveReview = await newReview.save()
        if (saveReview) {
           return res.status(200).json({status:true , review:saveReview})
        }
        throw new Error("Error occured while saving Review")

    } catch (error) {
        return res.status(500).json({ status: false, error: error.message })
    }
}

module.exports = addReview