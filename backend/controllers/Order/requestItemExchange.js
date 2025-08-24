const mongoose = require("mongoose");
const Order = require("../../models/order");
const Rma = require("../../models/rma");
const CustomError = require("../../utils/customError");
const { INTERNAL_SERVER_ERROR, RETURN_WINDOW_DAYS, DEFAULT_CURRENCY } = require("../../utils/constants");
const { nextOrderNumber } = require("../../utils/orderNumber");
const { adjustStock } = require("../../utils/inventory");
const {
  ORDER_TYPE,
  ORDER_STATUS,
  ORDER_ITEM_STATUS,
  PAYMENT_STATUS,
  RMA_TYPE,
  RMA_SCOPE,
  RMA_STATUS,
} = require("../../utils/enums");

/**
 * POST /api/orders/:orderId/items/:itemId/exchange
 * Body: { reason?, newSize?, newColor?, newSku?, newVariantId?, quantity?, notes? }
 *
 * - Validates 3-day window after deliveredAt
 * - Quantity: defaults to full line qty; may be reduced via body.quantity (1..item.quantity)
 * - Sets ORIGINAL order's item.status -> EXCHANGE_REQUESTED
 * - Reserves stock for replacement (by requested qty)
 * - Creates an EXCHANGE order (replacement) with a new orderNumber like EX0250001
 */
module.exports = async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId, itemId } = req.params;
    const { reason, newSize, newColor, newSku, newVariantId, quantity, notes } = req.body || {};

    if (!mongoose.Types.ObjectId.isValid(orderId) || !mongoose.Types.ObjectId.isValid(itemId)) {
      throw new CustomError("Invalid order or item id", 400);
    }

    // Fetch as a document (NOT lean) because we will update original item status
    const origin = await Order.findOne({ _id: orderId, userId }).exec();
    if (!origin) throw new CustomError("Order not found", 404);

    // Find the item subdoc
    const item =
      (origin.items && origin.items.id && origin.items.id(itemId)) ||
      origin.items.find((it) => String(it._id) === String(itemId));
    if (!item) throw new CustomError("Item not found in order", 404);

    // Eligibility: delivered & within N days
    const deliveredAt = item.deliveredAt ? new Date(item.deliveredAt).getTime() : 0;
    const windowMs = Number(RETURN_WINDOW_DAYS) * 24 * 60 * 60 * 1000;
    const withinWindow = deliveredAt > 0 && Date.now() - deliveredAt <= windowMs;
    if (!withinWindow) throw new CustomError("Item not eligible for exchange", 400);

    // Determine requested quantity (default full line). Must be integer 1..item.quantity
    const requestedQty =
      quantity === undefined || quantity === null ? Number(item.quantity || 1) : Number(quantity);
    if (!Number.isInteger(requestedQty) || requestedQty < 1) {
      throw new CustomError("Quantity must be an integer >= 1", 400);
    }
    if (requestedQty > Number(item.quantity || 1)) {
      throw new CustomError("Exchange quantity exceeds purchased quantity", 400);
    }

    // Build replacement line (fallback to original attributes if not provided)
    const replacementLine = {
      productId: item.productId,
      title: item.title,
      size: newSize || item.size,
      color: newColor || item.color,
      quantity: requestedQty,
      price: Number(item.price),
      subtotal: Number(item.price) * requestedQty,
      status: ORDER_ITEM_STATUS.EXCHANGE_REQUESTED,
      variantId: newVariantId || item.variantId,
      sku: newSku || item.sku,
      thumbnail: item.thumbnail,
    };

    // Reserve stock for replacement now (prevents oversell) by requested qty
    await adjustStock({
      productId: replacementLine.productId,
      variantId: replacementLine.variantId,
      size: replacementLine.size,
      color: replacementLine.color,
      delta: -requestedQty,
    });

    // 1) Create RMA (points to original order; will update with new exchange order id)
    const rma = await Rma.create({
      type: RMA_TYPE.EXCHANGE,
      scope: RMA_SCOPE.ITEM,
      originalOrderId: orderId,
      userId,
      itemId,
      reason,
      status: RMA_STATUS.REQUESTED,
      notes,
      exchange: {
        size: replacementLine.size,
        color: replacementLine.color,
        sku: replacementLine.sku,
      },
    });

    // 2) Mark ORIGINAL order item's status -> EXCHANGE_REQUESTED
    item.status = ORDER_ITEM_STATUS.EXCHANGE_REQUESTED;
    origin.markModified("items");
    await origin.save();

    // 3) Create EXCHANGE order (replacement)
    const orderNumber = await nextOrderNumber(ORDER_TYPE.EXCHANGE);

    const totals = {
      itemsTotal: replacementLine.subtotal,
      shippingFee: 0,
      discount: 0,
      grandTotal: replacementLine.subtotal,
    };

    const replacementOrder = await Order.create({
      userId,
      orderNumber,
      type: ORDER_TYPE.EXCHANGE,
      originalOrderId: origin._id,
      rmaId: rma._id,
      items: [replacementLine],
      totals,
      status: ORDER_STATUS.EXCHANGE_REQUESTED,
      payment: {
        method: origin.payment?.method || "CARD",
        status: PAYMENT_STATUS.PAID, // zero-value / covered by original (adjust if you charge deltas)
        amount: 0,
        currencies: DEFAULT_CURRENCY,
        createdAt: new Date(),
      },
      shipping: { status: "CREATED" }, // checkpoints can be appended later
      address: origin.address,
      placedAt: new Date(),
    });

    return res.status(201).json({
      status: true,
      message: "Exchange requested; replacement order created and original item marked",
      order: replacementOrder,
      rma: {
        _id: rma._id,
        type: rma.type,
        scope: rma.scope,
        status: rma.status,
        itemId: rma.itemId,
        reason: rma.reason,
        exchange: rma.exchange,
        createdAt: rma.createdAt,
      },
    });
  } catch (error) {
    console.error("Request item exchange error:", error.message);
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      status: false,
      error: error.message || INTERNAL_SERVER_ERROR,
    });
  }
};