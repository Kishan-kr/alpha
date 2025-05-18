const { validationResult } = require("express-validator")
const review = require("../../models/review")

const updateReview = async (req, res) => {
    try {
        if (!req.user.id) {
            throw new Error("User Id not provided")
        }
        if (!req.params.reviewId) {
            throw new Error("Review Id not provided")
        }
        const findReviewById = await review.findById(req.params.reviewId)        
        if (!findReviewById) {
            throw new Error(`Review not found with Id ${req.params.reviewId}`)
        }
        if (req.user.id !== String(findReviewById.userId)) {
            throw new Error("Invalid Action")
        }
        const result = validationResult(req)
        if (result.errors.length) {
            const err = result.errors.reduce(function (acc, erritem) {
                return { ...acc, [erritem.path]: erritem.msg }
            }, {})
            return res.status(422).json({ status: false, error: err })
        }
        const updatedReview = await review.findByIdAndUpdate(req.params.reviewId , req.body , {new:true}).select("-productId")
        if(!updatedReview){
            throw new Error("Updated Review not found")
        }
        return res.status(200).json({status:true , updatedReview:updatedReview})
    } catch (error) {
        return res.status(500).json({ status: false, error: error.message })
    }
}

module.exports = updateReview