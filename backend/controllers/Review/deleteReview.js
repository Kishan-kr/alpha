const review = require("../../models/review");
const { INTERNAL_SERVER_ERROR } = require("../../utilis/constants");
const CustomError = require("../../utilis/customError");

const deleteReview = async (req, res) => {
    try {
        const { id: userId } = req.user || {};
        const { reviewId } = req.params;

        if (!userId) {
            throw new CustomError("Unauthorized action", 401);
        }

        if (!reviewId) {
            throw new CustomError("Review ID is required", 400);
        }

        const existingReview = await review.findById(reviewId);

        if (!existingReview) {
            throw new CustomError(`Review not found`, 404);
        }

        if (String(existingReview.userId) !== userId) {
            throw new CustomError("You are not authorized to delete this review", 403);
        }

        const deletedReview = await review.findByIdAndDelete(reviewId);

        if (!deletedReview) {
            throw new CustomError("Failed to delete the review", 500);
        }

        return res.status(200).json({
            status: true,
            deletedReviewId: deletedReview._id
        });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({
            status: false,
            error: error.message || INTERNAL_SERVER_ERROR
        });
    }
};


module.exports = deleteReview