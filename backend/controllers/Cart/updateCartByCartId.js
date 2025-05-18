const { validationResult } = require("express-validator")
const cart = require("../../models/cart")

const updateCartByCartId = async (req, res) => {
    try {
        if (!req.user.id) {
            throw new Error("User Id not provided")
        }
        if (!req.params.cartId) {
            throw new Error("Cart Id not provided")
        }
        const result = validationResult(req)
        if (result.errors.length) {
            const err = result.errors.reduce(function (acc, erritem) {
                return { ...acc, [erritem.path]: erritem.msg }
            }, {})
            return res.status(422).json({ status: false, error: err })
        }
        const findCartByCartId = await cart.findById(req.params.cartId)
        if (!findCartByCartId) {
            throw new Error(`Cart Item not found with Id ${req.params.reviewId}`)
        }
        if (req.user.id !== String(findCartByCartId.userId)) {
            throw new Error("Invalid Action")
        }
        const updateCartDetails = await cart.findByIdAndUpdate(req.params.cartId, req.body, { new: true })
        if (!updateCartDetails) {
            throw new Error("Updated cart not found")
        }
        return res.status(200).json({ status: true, updateCart: updateCartDetails })
    } catch (error) {
        return res.status(500).json({ status: false, error: error.message })
    }
}

module.exports = updateCartByCartId