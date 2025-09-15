const express = require("express");
const authenticateUser = require("../middlwares/authenticateUser")
const { getCheckoutToken, getAllCollections, getAllProducts, verifyOrderToken } = require("../services/fastrr");
const router= express.Router()

// POST /api/fastrr/checkout/initiate       get checkout token from fastrr
router.post("/checkout/initiate" ,  getCheckoutToken)

// GET /api/fastrr/orders/verify       verify order token
router.get("/orders/verify" , verifyOrderToken)

// GET /api/fastrr/collections       get all collections
router.get("/collections" , getAllCollections)

// GET /api/fastrr/products       get all products
router.get("/products" , getAllProducts)

module.exports = router;