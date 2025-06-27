const express = require("express")
const addItemToCart = require("../controllers/Cart/addItemToCart")
const authenticateUser = require("../middlwares/authenticateUser")
const getCartItemsByUserId = require("../controllers/Cart/getCartItemByUserId")
const updateCartByCartId = require("../controllers/Cart/updateCartByCartId")
const removeCartItemById = require("../controllers/Cart/removeCartItemById")
const removeAllItemsFromCart = require("../controllers/Cart/removeAllItemsFromCart")
const router= express.Router()

// POST /api/carts/:productId        add item to cart
router.post("/:productId" , authenticateUser , addItemToCart)

// GET /api/carts        Get cart items of logged in user
router.get("/" , authenticateUser , getCartItemsByUserId)

// PATCH /api/carts        Update cart items of logged in user
router.patch("/:itemId" , authenticateUser, updateCartByCartId)

// DELETE /api/carts/:itemId        Remove an item from cart
router.delete("/:itemId" , authenticateUser , removeCartItemById)

// DELETE /api/carts/:itemId        Remove all items from cart
router.delete("/" , authenticateUser , removeAllItemsFromCart)

module.exports = router;