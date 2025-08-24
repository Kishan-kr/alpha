const mongoose = require("mongoose");
const Order = require("../../models/order");
const Rma = require("../../models/rma");
const CustomError = require("../../utils/customError");
const { INTERNAL_SERVER_ERROR } = require("../../utils/constants");
const { nextOrderNumber } = require("../../utils/orderNumber");
const {
  ORDER_TYPE,
  ORDER_STATUS,
  ORDER_ITEM_STATUS,
  PAYMENT_STATUS,
  RMA_TYPE,
  RMA_SCOPE,
  RMA_STATUS,
} = require("../../utils/enums");
const { RETURN_WINDOW_DAYS, DEFAULT_CURRENCY } = require("../../utils/constants");

/**
 * POST /api/orders/:orderId/items/:itemId/return
 * Body: { reason?: string, notes?: string }
 *
 * - Validates 3-day window after deliveredAt
 * - Creates an RMA (RETURN, ITEM)
 * - Creates a RETURN order (single line mirror) with a new orderNumber like RT0250001
 * - Does NOT change inventory here (restock happens on "received")
 */
module.exports = async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId, itemId } = req.params;
    const { reason, notes } = req.body || {};

    if (!mongoose.Types.ObjectId.isValid(orderId) || !mongoose.Types.ObjectId.isValid(itemId)) {
      throw new CustomError("Invalid order or item id", 400);
    }

    const origin = await Order.findOne({ _id: orderId, userId }).exec();
    if (!origin) throw new CustomError("Order not found", 404);

    // Find the item subdocument
    const item =
      (origin.items && origin.items.id && origin.items.id(itemId)) ||
      origin.items.find((it) => String(it._id) === String(itemId));
    if (!item) throw new CustomError("Item not found in order", 404);

    // Eligibility: delivered & within N days
    const deliveredAt = item.deliveredAt ? new Date(item.deliveredAt).getTime() : 0;
    const windowMs = Number(RETURN_WINDOW_DAYS) * 24 * 60 * 60 * 1000;
    const withinWindow = deliveredAt > 0 && Date.now() - deliveredAt <= windowMs;
    if (!withinWindow) throw new CustomError("Item not eligible for return", 400);

    // 1) Create RMA first (points to original order; we'll also store the new RETURN order id)
    const rma = await Rma.create({
      type: RMA_TYPE.RETURN,
      scope: RMA_SCOPE.ITEM,
      originalOrderId: orderId,
      userId,
      itemId,
      reason,
      status: RMA_STATUS.REQUESTED,
      notes,
    });

    // 2) Mark ORIGINAL order item's status -> RETURN_REQUESTED
    item.status = ORDER_ITEM_STATUS.RETURN_REQUESTED;
    origin.markModified("items");
    await origin.save();

    // 3) Create RETURN order (single-line mirror)
    const orderNumber = await nextOrderNumber(ORDER_TYPE.RETURN);

    const line = {
      productId: item.productId,
      title: item.title,
      size: item.size,
      color: item.color,
      quantity: item.quantity || 1,
      price: item.price,
      subtotal: item.subtotal ?? item.price * (item.quantity || 1),
      status: ORDER_ITEM_STATUS.RETURN_REQUESTED,
      variantId: item.variantId,
      sku: item.sku,
      thumbnail: item.thumbnail,
      deliveredAt: item.deliveredAt || undefined,
    };

    const totals = {
      itemsTotal: line.subtotal,
      shippingFee: 0,
      discount: 0,
      grandTotal: line.subtotal,
    };

    const returnOrder = await Order.create({
      userId,
      orderNumber,
      type: ORDER_TYPE.RETURN,
      originalOrderId: origin._id,
      rmaId: rma._id,
      items: [line],
      totals,
      status: ORDER_STATUS.RETURN_REQUESTED,
      payment: {
        method: origin.payment?.method || "CARD",
        status: PAYMENT_STATUS.REFUND_PENDING,
        amount: line.subtotal,
        currencies: DEFAULT_CURRENCY,
        createdAt: new Date(),
      },
      shipping: {}, // pickup logistics can later populate shipment/checkpoints if you wish
      address: origin.address,
      placedAt: new Date(),
    });

    return res.status(201).json({
      status: true,
      message: "Return requested; return order created",
      order: returnOrder,
      rma: {
        _id: rma._id,
        type: rma.type,
        scope: rma.scope,
        status: rma.status,
        itemId: rma.itemId,
        reason: rma.reason,
        createdAt: rma.createdAt,
      },
    });
  } catch (error) {
    console.error("Request item return error:", error.message);
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      status: false,
      error: error.message || INTERNAL_SERVER_ERROR,
    });
  }
};