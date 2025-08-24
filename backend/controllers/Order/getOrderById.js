const mongoose = require("mongoose");
const Order = require("../../models/order");
const Rma = require("../../models/rma");
const CustomError = require("../../utils/customError");
const {
  INTERNAL_SERVER_ERROR = "Internal server error",
} = require("../../utils/constants");


/**
 * GET /api/orders/:orderId
 * Returns an order owned by the session user, with:
 * - order core fields
 * - embedded RMA snapshot (if rmaId present)
 * - minimal original order snapshot (if originalOrderId present)
 */
module.exports = async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId } = req.params;

    if (!orderId || !mongoose.Types.ObjectId.isValid(orderId)) {
      throw new CustomError("Invalid order id", 400);
    }

    // Fetch order (owned by this user)
    let order = await Order.findOne({ _id: orderId, userId }).lean();
    if (!order) throw new CustomError("Order not found", 404);

    // Attach RMA snapshot if present
    if (order.rmaId) {
      const rma = await Rma.findById(order.rmaId)
        .select({
          _id: 1,
          type: 1,
          scope: 1,
          status: 1,
          reason: 1,
          notes: 1,
          itemId: 1,
          exchange: 1,
          createdAt: 1,
          updatedAt: 1,
        })
        .lean();
      if (rma) order.rma = rma;
    }

    // Attach minimal original order reference for RETURN/EXCHANGE types
    // if (order.originalOrderId) {
    //   const original = await Order.findOne(
    //     { _id: order.originalOrderId, userId },
    //     {
    //       _id: 1,
    //       orderNumber: 1,
    //       placedAt: 1,
    //       deliveredAt: 1,
    //       status: 1,
    //       type: 1,
    //     }
    //   ).lean();
    //   if (original) order.originalOrder = original;
    // }

    return res.status(200).json({
      status: true,
      order,
    });
  } catch (error) {
    console.error("Get order by id error:", error.message);
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      status: false,
      error: error.message || INTERNAL_SERVER_ERROR,
    });
  }
};