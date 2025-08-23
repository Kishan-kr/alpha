const { validationResult } = require("express-validator")
const review = require("../../models/review");
const CustomError = require("../../utils/customError");
const { INTERNAL_SERVER_ERROR } = require("../../utils/constants");

const updateReview = async (req, res) => {
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
            throw new CustomError("You are not authorized to update this review", 403);
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ status: false, error: errors.array()[0]?.msg });
        }

        const { rating, comment, images } = req.body;
        const updates = {};
        if (rating) {
            updates.rating = rating;
        }
        if (comment) {
            updates.comment = comment;
        }
        if (images) {
            updates.images = images;
        }

        const updatedReview = await review
            .findByIdAndUpdate(reviewId, updates, { new: true })
            .select("-productId");

        if (!updatedReview) {
            throw new CustomError("Failed to update the review", 500);
        }

        return res.status(200).json({
            status: true,
            review: updatedReview,
        });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({
            status: false,
            error: error.message || INTERNAL_SERVER_ERROR,
        });
    }
};

module.exports = updateReview