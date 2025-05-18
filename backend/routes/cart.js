const express = require("express")
const addCart = require("../controllers/Cart/addCart")
const authenticateUser = require("../middlwares/authenticateUser")
const getCartItemsByUserId = require("../controllers/Cart/getCartItemByUserId")
const updateCartByCartId = require("../controllers/Cart/updateCartByCartId")
const { body } = require("express-validator")
const deleteCartItemByCartId = require("../controllers/Cart/deleteCartItemByCartId")
const router= express.Router()

//add cart
router.post("/add-cart/:productId" , authenticateUser , addCart)

//get cartitem by UserId
router.get("/get-cartItem" , authenticateUser , getCartItemsByUserId)

//update cart by cart Id
router.patch("/update-cart/:cartId" , authenticateUser , [
   body("quantity").notEmpty().withMessage('Quantity is required')
] ,updateCartByCartId)

router.delete("/delete-cart/:cartId" , authenticateUser , deleteCartItemByCartId)

module.exports=router