const express = require("express");
const router = express.Router();
const authenticateUser = require("../middlwares/authenticateUser");

const createOrder = require("../controllers/Order/createOrder");
const getOrdersByUserId = require("../controllers/Order/getOrdersByUserId");
const getOrderById = require("../controllers/Order/getOrderById");

const cancelWholeOrder = require("../controllers/Order/cancelWholeOrder");

const requestItemReturn = require("../controllers/Order/requestItemReturn");
const requestItemExchange = require("../controllers/Order/requestItemExchange");

// const markReturnPickedUp = require("../controllers/Order/markReturnPickedUp");
// const markReturnReceived = require("../controllers/Order/markReturnReceived");
// const markExchangeDelivered = require("../controllers/Order/markExchangeDelivered");

router.post("", authenticateUser, createOrder);
router.get("", authenticateUser, getOrdersByUserId);
router.get("/:orderId", authenticateUser, getOrderById);

router.post("/:orderId/cancel", authenticateUser, cancelWholeOrder);

// item-level RMA initiations (both create a new ORDER of type RETURN/EXCHANGE)
router.post("/:orderId/items/:itemId/return", authenticateUser, requestItemReturn);
router.post("/:orderId/items/:itemId/exchange", authenticateUser, requestItemExchange);

// operational status updates
// router.post("/rmas/:rmaId/picked-up", authenticateUser, markReturnPickedUp);
// router.post("/rmas/:rmaId/received", authenticateUser, markReturnReceived);
// router.post("/rmas/:rmaId/exchange-delivered", authenticateUser, markExchangeDelivered);

module.exports = router;