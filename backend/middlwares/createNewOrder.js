const Order = require("../models/order");
const CustomError = require("../utils/customError");
const { INTERNAL_SERVER_ERROR } = require("../utils/constants");
const { adjustStock } = require("../utils/inventory");
const { nextOrderNumber } = require("../utils/orderNumber");
const { ORDER_TYPE, PAYMENT_METHOD, PAYMENT_STATUS, DEFAULT_CURRENCY, ORDER_STATUS } = require("../utils/enums");

/**
 * Body: { items[], totals{itemsTotal,shippingFee,discount,grandTotal}, payment{method}, address{}, shipping?{} }
 * - Creates a NEW order prepaid order
 * - Reserves stock for each line item
 * - Generates orderNumber like NW0250001
 */
const createNewOrder = async (req, res, next) => {
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
          size: it.size,
          color: it.color,
          delta: -Number(it.quantity || 0),
        })
      )
    );

    const initialOrderStatus = ORDER_STATUS.INITIATED;
    const initialPaymentStatus = PAYMENT_STATUS.PENDING;

    const doc = await Order.create({
      userId,
      orderNumber,
      type: ORDER_TYPE.NEW,
      originalOrderId: null,
      rmaId: null,
      items,
      totals: {
        itemsTotal: totals?.subtotal,
        shippingFee: totals?.delivery,
        discount: totals?.discount,
        grandTotal: totals?.grandTotal,
      },
      status: initialOrderStatus,
      payment: {
        method: PAYMENT_METHOD.NONE, // As payment.method is not yet verified, setting it to NONE initially
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

    if (!doc) {
      throw new CustomError("Unable to create order", 503);
    }

    req.order = {
      orderId: doc._id,
      orderNumber: doc.orderNumber,
      currency: doc.payment?.currency,
      amount: doc.payment?.amount || 0
    };

    next();
  } catch (error) {
    console.error("Unable to create order in DB:", error.message);
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      status: false,
      error: error.message || INTERNAL_SERVER_ERROR,
    });
  }
};

module.exports = createNewOrder;