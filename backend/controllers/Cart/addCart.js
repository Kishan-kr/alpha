const cart = require("../../models/cart")

const addCart = async (req, res) => {
    try {
        if (!req.params.productId) {
            throw new Error("Produt Id not found")
        }
        const checkItemWithUserIdexists = await cart.findOne({ userId:req.user.id, productId:req.params.productId })
        if (!checkItemWithUserIdexists) {
            const newCart = new cart({
                userId: req.user.id,
                productId: req.params.productId,
                ...req.body
            })
            const saveCart = await newCart.save()
            if (!saveCart) {
                throw new Error("Error occured while saving item to cart")
            }
            return res.status(200).json({ status: true, message: "Item Added to Cart" })
        }
        throw new Error("Item exists")

    } catch (error) {
        return res.status(500).json({ status: false, error: error.message })
    }
}

module.exports = addCart