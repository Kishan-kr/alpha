const express = require("express")
const createOrder = require("../controllers/Order/createOrderWithTransaction")
const getOrdersByUserId = require("../controllers/Order/getOrdersByUserId")
const updateOrderStatus_ProductStatusByOrderId = require("../controllers/Order/updateOrderStatus_ProductStatusByOrderId")
const updateSingleOrderById = require("../controllers/Order/updateSingleOrderById")
const authenticateUser = require("../middlwares/authenticateUser")
const router = express.Router()

//create order using mongodb transactions
router.post("/", authenticateUser, createOrder)  //reminder adding middle ware(authenticateuser) for getting userID

//get all orders by userId
router.get("/" , getOrdersByUserId)   //reminder adding middle ware(authenticateuser) for getting userID

//update order status
router.put("/update-orderStatus/:orderId/:status" , updateOrderStatus_ProductStatusByOrderId)  //reminder adding middle for getting the details of admin(authenticateadmin) who changed status

//update a single product status
router.put("/update-singleproduct/:id/:status" , updateSingleOrderById)   //reminder adding middle ware(authenticateuser) for getting userID

module.exports=router