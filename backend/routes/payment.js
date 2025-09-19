const express = require("express");
const router = express.Router();
const { verifyPayment, createRazorpayOrder } = require("../services/razorpay");
const authenticateUser = require("../middlwares/authenticateUser");
const createNewOrder = require("../middlwares/createNewOrder");
const verifyStocks = require("../middlwares/verifyStocks");

router.post("/create-order", authenticateUser, verifyStocks, createNewOrder, createRazorpayOrder);

router.post("/verify-payment", authenticateUser, verifyPayment);

module.exports = router;