const Order = require("../../models/order");
const CustomError = require("../../utils/customError");
const { INTERNAL_SERVER_ERROR } = require("../../utils/constants");
const { adjustStock } = require("../../utils/inventory");
const { nextOrderNumber } = require("../../utils/orderNumber");
const { ORDER_TYPE, PAYMENT_METHOD, PAYMENT_STATUS, DEFAULT_CURRENCY } = require("../../utils/enums");

/**
 * POST /api/orders
 * Body: { items[], totals{itemsTotal,shippingFee,discount,grandTotal}, payment{method}, address{}, shipping?{} }
 * - Creates a NEW order
 * - Reserves stock for each line item
 * - Generates orderNumber like NW0250001
 */
module.exports = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      items = [],
      totals,
      payment,
      address,
      shipping = {},
    } = req.body || {};

    // basic validations
    if (!items.length) throw new CustomError("Order must contain at least one item", 400);
    if (!totals?.grandTotal && totals?.grandTotal !== 0) throw new CustomError("Totals are required", 400);
    if (!payment?.method) throw new CustomError("Payment method is required", 400);
    if (!address) throw new CustomError("Address is required", 400);

    // generate order number with year-aware counter
    const orderNumber = await nextOrderNumber(ORDER_TYPE.NEW);

    // reserve stock now
    await Promise.all(
      items.map((it) =>
        adjustStock({
          productId: it.productId,
          variantId: it.variantId,
          size: it.size,
          color: it.color,
          delta: -Number(it.quantity || 0),
        })
      )
    );

    // derive initial order + payment status
    const isCOD = String(payment.method).toUpperCase() === PAYMENT_METHOD.COD;
    const initialOrderStatus = isCOD ? "PENDING" : "CONFIRMED";
    const initialPaymentStatus = isCOD ? PAYMENT_STATUS.PENDING : PAYMENT_STATUS.PAID;

    const doc = await Order.create({
      userId,
      orderNumber,
      type: ORDER_TYPE.NEW,
      originalOrderId: null,
      rmaId: null,
      items,
      totals,
      status: initialOrderStatus,
      payment: {
        method: payment.method,
        status: initialPaymentStatus,
        amount: totals.grandTotal,
        transactionId: payment.transactionId || undefined,
        currency: DEFAULT_CURRENCY,
        createdAt: new Date(),
      },
      shipping,
      address,
      placedAt: new Date(),
    });

    return res.status(201).json({
      status: true,
      message: "Order placed successfully",
      order: doc,
    });
  } catch (error) {
    console.error("Create order error:", error.message);
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      status: false,
      error: error.message || INTERNAL_SERVER_ERROR,
    });
  }
};