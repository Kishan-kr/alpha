const review = require("../../models/review");
const { INTERNAL_SERVER_ERROR } = require("../../utils/constants");
const CustomError = require("../../utils/customError")

const getReviewByProductId = async (req, res) => {
    try {
        const { productId } = req.params;

        if (!productId) {
            throw new CustomError("Product Id is required", 400);
        }

        const reviews = await review.find({ productId }).populate({
            path: "userId",
            select: "_id firstName lastName"
        }).select("-productId");

        return res.status(200).json({ status: true, reviews });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({
            status: false,
            error: error.message || INTERNAL_SERVER_ERROR
        });
    }
}

module.exports = getReviewByProductId