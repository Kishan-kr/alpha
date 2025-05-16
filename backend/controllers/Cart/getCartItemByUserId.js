const cart = require("../../models/cart")

const getCartItemsByUserId = async (req, res) => {
    try {
        return res.status(200).json({
            status: true,
            cartItems: await cart.find({ userId: req.user.id }).populate({
                path: "productId",
                select: "title thumbnailImg discountPrice"
            }).select("-userId")
        })
    } catch (error) {
        return res.status(500).json({ status: false, error: error.message })
    }
}

module.exports = getCartItemsByUserId