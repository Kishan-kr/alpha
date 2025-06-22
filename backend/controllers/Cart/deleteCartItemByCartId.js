const cart = require("../../models/cart")

const deleteCartItemByCartId = async (req, res) => {
    try {
        if (!req.user.id) {
            throw new Error("User Id not provided")
        }
        if (!req.params.cartId) {
            throw new Error("Cart Id not provided")
        }
        const findCartByCartId = await cart.findById(req.params.cartId)
        if (!findCartByCartId) {
            throw new Error(`Cart Item not found with Id ${req.params.reviewId}`)
        }
        if (req.user.id !== String(findCartByCartId.userId)) {
            throw new Error("Invalid Action")
        }
        const deleteCartItem = await cart.findByIdAndDelete(req.params.cartId)
        if(!deleteCartItem){
            throw new Error("Deleted Cart item not found")
        }
        return res.status(200).json({status:true , deleteCartItem:deleteCartItem._id , message:"Item Removed"})
    } catch (error) {
        return res.status(500).json({ status: false, error: error.message })
    }
}

module.exports = deleteCartItemByCartId