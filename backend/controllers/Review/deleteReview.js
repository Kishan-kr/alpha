const review = require("../../models/review")

const deleteReview = async (req, res) => {
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
        const deleteReviewbyID = await review.findByIdAndDelete(req.params.reviewId)
        if (!deleteReviewbyID) {
            throw new Error("Deleted Review not found")
        }
        return res.status(200).json({ status: true, deleteReviewbyID: deleteReviewbyID._id })
    } catch (error) {
        return res.status(500).json({ status: false, error: error.message })
    }
}

module.exports = deleteReview