const { validationResult } = require("express-validator")
const review = require("../../models/review");
const CustomError = require("../../utilis/customError");
const { INTERNAL_SERVER_ERROR } = require("../../utilis/constants");
const Order = require("../../models/order");
const OrderedProduct = require("../../models/orderedProduct");

const addReview = async (req, res) => {
    try {
        const userId = req.user.id;
        const productId = req.params.productId;

        if (!userId) {
            throw new CustomError("Unauthorized action", 401);
        }
        if (!productId) {
            throw new CustomError("Product ID is required", 400);
        }

        // Step 1: Check if user has an order with this product
        const userOrders = await Order.find({ userId }).select('_id'); // get all orderIds of the user
        const orderIds = userOrders.map(order => order._id);

        // Step 2: Check if any of those orders contain this product
        const hasPurchased = await OrderedProduct.exists({
            orderId: { $in: orderIds },
            productId: productId
        });

        if (!hasPurchased) {
            throw new CustomError("Only buyers can post reviews for this product.", 403);
        }

        const { comment, images } = req.body;
        const rating = Number(req.body.rating);

        
        // check for validation errors 
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ status: false, error: errors.array()[0]?.msg });
        }
        
        console.log('rating: ', rating);
        // Check for duplicates
        const existingReview = await review.findOne({ productId, userId });
        if (existingReview) {
            throw new CustomError("Review already exists for this product", 409);
        }

        const newReview = new review({
            productId,
            userId,
            rating,
            comment,
            images: images || []
        });
        await newReview.save()
        if (!newReview) {
            throw new CustomError("Unabled to add the review");
        }

        res.status(201).json({ status: true, message: "Review added successfully", review: newReview });

    } catch (error) {
        console.error("Add to cart error:", error.message);
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({
            status: false,
            error: error.message || INTERNAL_SERVER_ERROR
        });
    }
}

module.exports = addReview