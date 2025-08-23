const Order = require("../../../models/order");
const Rma = require("../../../models/rma");
const CustomError = require("../../../utils/customError");
const constants = require("../../../utils/constants");
const { adjustStock } = require("../../../utils/inventory");
const { canTransition } = require("../../../utils/orderTransitions");
const {
  ORDER_TYPE,
  ORDER_STATUS,
  ORDER_ITEM_STATUS,
  PAYMENT_METHOD,
  PAYMENT_STATUS,
  RMA_STATUS,
} = require("../../../utils/enums");

const INTERNAL_SERVER_ERROR = constants.INTERNAL_SERVER_ERROR || "Internal server error";

/**
 * PATCH /api/admin/orders/:orderId/status
 * Body: { status: string, note?: string }
 *
 * - Single generic admin endpoint to update order.status based on order.type
 * - Validates transition using utils/orderTransitions.canTransition
 * - Applies side-effects (timestamps, stock, payments, RMA + original item status)
 */
module.exports = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, note } = req.body || {};

    if (!status) throw new CustomError("Target status is required", 400);

    // Load order as a document for mutation
    const order = await Order.findById(orderId).exec();
    if (!order) throw new CustomError("Order not found", 404);

    const current = order.status;
    const type = order.type;

    if (!canTransition(type, current, status)) {
      throw new CustomError(`Invalid transition for ${type}: ${current} → ${status}`, 400);
    }

    // Preload RMA (if exists) for original item operations
    let rmaDoc = null;
    if (order.rmaId) {
      rmaDoc = await Rma.findById(order.rmaId).exec();
    }

    // ---------- Side-effects per type + target status ----------
    if (type === ORDER_TYPE.NEW) {
      if (status === ORDER_STATUS.DELIVERED) {
        order.deliveredAt = new Date();
        // Ensure each item has deliveredAt (used for 3-day window)
        (order.items || []).forEach((it) => {
          if (!it.deliveredAt) it.deliveredAt = order.deliveredAt;
        });
        // COD collection on delivery
        if (String(order.payment?.method).toUpperCase() === PAYMENT_METHOD.COD) {
          order.payment.status = PAYMENT_STATUS.PAID;
          order.markModified("payment");
        }
      }
      // (optional) you can update order.shipping.status / checkpoints based on SHIPPED/OUT_FOR_DELIVERY etc.
    }

    if (type === ORDER_TYPE.EXCHANGE) {
      if (status === ORDER_STATUS.DELIVERED) {
        order.deliveredAt = new Date();
        if (order.items?.length) {
          order.items[0].status = ORDER_ITEM_STATUS.EXCHANGE_DELIVERED;
          if (!order.items[0].deliveredAt) order.items[0].deliveredAt = order.deliveredAt;
        }
        // Close RMA if present
        if (rmaDoc) {
          rmaDoc.status = RMA_STATUS.CLOSED;
          await rmaDoc.save();
        }
      }

      if (status === ORDER_STATUS.EXCHANGE_REJECTED) {
        // Release reserved replacement stock
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
        // Mark original item as EXCHANGE_REJECTED (requires rma.itemId)
        if (order.originalOrderId && rmaDoc?.itemId) {
          const original = await Order.findById(order.originalOrderId).exec();
          if (original) {
            const origItem =
              (original.items && original.items.id && original.items.id(rmaDoc.itemId)) ||
              original.items.find((x) => String(x._id) === String(rmaDoc.itemId));
            if (origItem) {
              origItem.status = ORDER_ITEM_STATUS.EXCHANGE_REJECTED;
              original.markModified("items");
              await original.save();
            }
          }
        }
        // Close RMA
        if (rmaDoc) {
          rmaDoc.status = RMA_STATUS.REJECTED;
          await rmaDoc.save();
        }
      }

      if (status === ORDER_STATUS.CANCELLED) {
        // This is admin-forced cancel; mimic cancel endpoint behavior for EXCHANGE
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
        // If any amount charged & paid, initiate refund
        if (Number(order.payment?.amount) > 0 && order.payment?.status === PAYMENT_STATUS.PAID) {
          order.payment.status = PAYMENT_STATUS.REFUND_PENDING;
          order.markModified("payment");
        }
        // Clear original item status back to undefined (cancelled, not rejected)
        if (order.originalOrderId && rmaDoc?.itemId) {
          const original = await Order.findById(order.originalOrderId).exec();
          if (original) {
            const origItem =
              (original.items && original.items.id && original.items.id(rmaDoc.itemId)) ||
              original.items.find((x) => String(x._id) === String(rmaDoc.itemId));
            if (origItem) {
              origItem.status = undefined;
              original.markModified("items");
              await original.save();
            }
          }
        }
        if (rmaDoc) {
          rmaDoc.status = RMA_STATUS.CLOSED;
          await rmaDoc.save();
        }
      }
    }

    if (type === ORDER_TYPE.RETURN) {
      if (status === ORDER_STATUS.PICKED_UP) {
        // You can append shipping checkpoints here if you track pickup logistics
      }

      if (status === ORDER_STATUS.RECEIVED) {
        // Restock returned items
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
      }

      if (status === ORDER_STATUS.RETURN_COMPLETED) {
        // Ensure payment refunded
        order.payment.status = PAYMENT_STATUS.REFUNDED;
        order.markModified("payment");
        // Mark original item as RETURNED (requires rma.itemId)
        if (order.originalOrderId && rmaDoc?.itemId) {
          const original = await Order.findById(order.originalOrderId).exec();
          if (original) {
            const origItem =
              (original.items && original.items.id && original.items.id(rmaDoc.itemId)) ||
              original.items.find((x) => String(x._id) === String(rmaDoc.itemId));
            if (origItem) {
              origItem.status = ORDER_ITEM_STATUS.RETURNED;
              original.markModified("items");
              await original.save();
            }
          }
        }
        // Close RMA
        if (rmaDoc) {
          rmaDoc.status = RMA_STATUS.CLOSED;
          await rmaDoc.save();
        }
      }

      if (status === ORDER_STATUS.RETURN_REJECTED) {
        // No stock movement; refund is cancelled
        order.payment.status = PAYMENT_STATUS.REFUND_CANCELLED;
        order.markModified("payment");

        // Mark original item as RETURN_REJECTED
        if (order.originalOrderId && rmaDoc?.itemId) {
          const original = await Order.findById(order.originalOrderId).exec();
          if (original) {
            const origItem =
              (original.items && original.items.id && original.items.id(rmaDoc.itemId)) ||
              original.items.find((x) => String(x._id) === String(rmaDoc.itemId));
            if (origItem) {
              origItem.status = ORDER_ITEM_STATUS.RETURN_REJECTED;
              original.markModified("items");
              await original.save();
            }
          }
        }
        // RMA rejected
        if (rmaDoc) {
          rmaDoc.status = RMA_STATUS.REJECTED;
          await rmaDoc.save();
        }
      }

      if (status === ORDER_STATUS.CANCELLED) {
        // Return order cancelled (user/admin aborts the refund)
        order.payment.status = PAYMENT_STATUS.REFUND_CANCELLED;
        order.markModified("payment");

        // Clear original item status back to undefined
        if (order.originalOrderId && rmaDoc?.itemId) {
          const original = await Order.findById(order.originalOrderId).exec();
          if (original) {
            const origItem =
              (original.items && original.items.id && original.items.id(rmaDoc.itemId)) ||
              original.items.find((x) => String(x._id) === String(rmaDoc.itemId));
            if (origItem) {
              origItem.status = undefined;
              original.markModified("items");
              await original.save();
            }
          }
        }
        if (rmaDoc) {
          rmaDoc.status = RMA_STATUS.CLOSED;
          await rmaDoc.save();
        }
      }
    }

    // ---------- Apply status & meta ----------
    order.status = status;
    // optional: push a shipping checkpoint note
    if (note) {
      order.shipping = order.shipping || {};
      order.shipping.checkpoints = order.shipping.checkpoints || [];
      order.shipping.checkpoints.push({ status, at: new Date(), note });
      order.markModified("shipping");
    }

    await order.save();

    return res.status(200).json({
      status: true,
      message: `Order status updated: ${current} → ${status}`,
      order,
    });
  } catch (error) {
    console.error("Admin update order status error:", error.message);
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      status: false,
      error: error.message || INTERNAL_SERVER_ERROR,
    });
  }
};