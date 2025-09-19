const Order = require("../../models/order");
const CustomError = require("../../utils/customError");
const { INTERNAL_SERVER_ERROR } = require("../../utils/constants");
const { adjustStock } = require("../../utils/inventory");
const { nextOrderNumber } = require("../../utils/orderNumber");
const { ORDER_TYPE, PAYMENT_METHOD, PAYMENT_STATUS, DEFAULT_CURRENCY, ORDER_STATUS } = require("../../utils/enums");
const crypto = require("crypto");
const { clearUserCart } = require("../../utils/cart");
const User = require("../../models/user");

/**
 * POST /api/orders
 * For COD orders only
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
          size: it.size,
          color: it.color,
          delta: -Number(it.quantity || 0),
        })
      )
    );

    // derive initial order + payment status
    const isCOD = String(payment.method).toUpperCase() === PAYMENT_METHOD.COD;
    const initialOrderStatus = ORDER_STATUS.PENDING;
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
        method: payment.method || PAYMENT_METHOD.COD,
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

    // Clear cart of the user (reusable utility)
    try {
      await clearUserCart(doc.userId);
    } catch (cartErr) {
      console.error("Failed to clear user cart after payment:", cartErr.message);
    }

    // Send confirmation SMS and/or email using user info
    try {
      const user = await User.findById(userId).select("phone email");

      require("../../services/smtp").sendOrderConfirmationEmailToAdmin(doc.orderNumber, doc);
      
      if (user?.email) {
        require("../../services/smtp").sendOrderConfirmationEmail(user.email, doc.orderNumber, doc);
      }

      if (user?.phone) {
        require("../../services/twoFactor").sendOrderConfirmationSMS(user.phone, doc.orderNumber, doc.totals?.grandTotal);
      }
    } catch (notifyErr) {
      console.error("Failed to send order confirmation notification:", notifyErr.message);
    }

    const token = crypto.randomBytes(64).toString("hex");
    console.log('COD order placed with order id', doc._id); // debug

    return res.status(201).json({
      status: true,
      message: "Order placed successfully",
      order: doc,
      token
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