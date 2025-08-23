const review = require("../../models/review");
const { INTERNAL_SERVER_ERROR } = require("../../utils/constants");
const CustomError = require("../../utils/customError")

const getReviewById = async (req, res) => {
    try {
        const { reviewId } = req.params;

        if (!reviewId) {
            throw new CustomError("Review ID is required", 400);
        }

        const foundReview = await review.findById(reviewId).populate({
            path: "userId",
            select: "_id firstName lastName"
        }).select("-productId");

         if (!foundReview) {
            throw new CustomError("Review not found", 404);
        }

        return res.status(200).json({ status: true, review: foundReview });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({
            status: false,
            error: error.message || INTERNAL_SERVER_ERROR
        });
    }
}

module.exports = getReviewById