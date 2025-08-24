const Order = require("../../models/order");
const Rma = require("../../models/rma");
const CustomError = require("../../utils/customError");
const { CANCEL_WINDOW_HOURS, INTERNAL_SERVER_ERROR } = require("../../utils/constants");
const { adjustStock } = require("../../utils/inventory");
const {
  ORDER_TYPE,
  ORDER_STATUS,
  PAYMENT_METHOD,
  PAYMENT_STATUS,
  RMA_STATUS,
} = require("../../utils/enums");

/**
 * POST /api/orders/:orderId/cancel
 * Rules:
 * - Allowed within CANCEL_WINDOW_HOURS from placedAt.
 * - Block if status already SHIPPED/OUT_FOR_DELIVERY/DELIVERED or CANCELLED.
 * - Stock:
 *    - NEW: restock all items (+qty)
 *    - EXCHANGE: restock reserved replacement items (+qty)
 *    - RETURN: no stock change (restock only on 'received')
 * - Payment:
 *    - NEW (prepaid): REFUND_PENDING
 *    - NEW (COD): NOT_COLLECTED
 *    - RETURN: REFUND_FAILED (request withdrawn)
 *    - EXCHANGE: usually zero-amount → leave as-is; if amount>0 & PAID, set REFUND_PENDING
 * - RMA:
 *    - If order has rmaId, set rma.status = CLOSED
 * - Original order item:
 *    - If cancelling RETURN/EXCHANGE order, revert original item's status to undefined.
 */
module.exports = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    const order = await Order.findOne({ _id: orderId, userId }).exec();
    if (!order) throw new CustomError("Order not found", 404);

    if (order.status === ORDER_STATUS.CANCELLED) {
      throw new CustomError("Order already cancelled", 400);
    }
    if ([ORDER_STATUS.SHIPPED, ORDER_STATUS.OUT_FOR_DELIVERY, ORDER_STATUS.DELIVERED].includes(order.status)) {
      throw new CustomError("Order cannot be cancelled after shipment", 400);
    }

    // 24h window check
    const placedTs = order.placedAt ? new Date(order.placedAt).getTime() : 0;
    const withinWindow = placedTs && (Date.now() - placedTs) <= Number(CANCEL_WINDOW_HOURS) * 60 * 60 * 1000;
    if (!withinWindow) {
      throw new CustomError(`Order can be cancelled within ${CANCEL_WINDOW_HOURS} hours of placement`, 400);
    }

    // If there's an RMA tied to this order, close it
    let rmaItemId = null;
    if (order.rmaId) {
      const rmaDoc = await Rma.findById(order.rmaId).select("itemId").exec();
      if (rmaDoc) {
        rmaItemId = rmaDoc.itemId ? String(rmaDoc.itemId) : null;
        rmaDoc.status = RMA_STATUS.CLOSED;
        await rmaDoc.save();
      }
    }

    // Handle per-type side-effects
    if (order.type === ORDER_TYPE.NEW) {
      // Restock all purchased items
      await Promise.all(
        (order.items || []).map((it) =>
          adjustStock({
            productId: it.productId,
            variantId: it.variantId,
            size: it.size,
            color: it.color,
            delta: Number(it.quantity || 0),
          })
        )
      );

      // Payment
      const isCOD = String(order.payment?.method).toUpperCase() === PAYMENT_METHOD.COD;
      order.payment.status = isCOD ? PAYMENT_STATUS.NOT_COLLECTED : PAYMENT_STATUS.REFUND_PENDING;
      order.markModified("payment");
    }

    if (order.type === ORDER_TYPE.EXCHANGE) {
      // Restock replacement items (we reserved them at request time)
      await Promise.all(
        (order.items || []).map((it) =>
          adjustStock({
            productId: it.productId,
            variantId: it.variantId,
            size: it.size,
            color: it.color,
            delta: Number(it.quantity || 0),
          })
        )
      );

      // If any positive amount was charged and paid, initiate refund
      // if (Number(order.payment?.amount) > 0 && order.payment?.status === PAYMENT_STATUS.PAID) {
      //   order.payment.status = PAYMENT_STATUS.REFUND_PENDING;
      //   order.markModified("payment");
      // }

      // Revert original order item's status (EXCHANGE_REQUESTED → undefined)
      
    }

    if (order.type === ORDER_TYPE.RETURN) {
      // No stock change for return orders
      // Payment (this cancels refund request)
      order.payment.status = PAYMENT_STATUS.REFUND_FAILED;
      order.markModified("payment");

      // Revert original order item's status (RETURN_REQUESTED → undefined)
      if (order.originalOrderId) {
        const original = await Order.findOne({ _id: order.originalOrderId, userId }).exec();
        if (original) {
          // Prefer RMA.itemId if available
          let itemId = null;
          if (order.rmaId) {
            const rmaDoc = await Rma.findById(order.rmaId).lean();
            itemId = rmaDoc?.itemId ? String(rmaDoc.itemId) : null;
          }
          const ret = order.items?.[0];
          const match =
            (itemId && (original.items.id?.(itemId) || original.items.find((x) => String(x._id) === itemId))) ||
            (ret &&
              (original.items.find(
                (x) =>
                  String(x.productId) === String(ret.productId) &&
                  String(x.sku || "") === String(ret.sku || "")
              ) ||
                original.items.find((x) => String(x.productId) === String(ret.productId))));
          if (match) {
            match.status = undefined;
            original.markModified("items");
            await original.save();
          }
        }
      }
    }

    // Revert ORIGINAL order item's status
    if (order.originalOrderId && rmaItemId) {
      const original = await Order.findOne({ _id: order.originalOrderId, userId }).exec();
      if (original) {
        const origItem =
          (original.items && original.items.id && original.items.id(rmaItemId)) ||
          original.items.find((x) => String(x._id) === rmaItemId);
        if (origItem) {
          origItem.status = undefined;
          original.markModified("items");
          await original.save();
        }
      }
    }

    // Finalize cancellation
    order.status = ORDER_STATUS.CANCELLED;
    order.cancelledAt = new Date();
    await order.save();

    return res.status(200).json({
      status: true,
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    console.error("Cancel order error:", error.message);
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      status: false,
      error: error.message || INTERNAL_SERVER_ERROR,
    });
  }
};