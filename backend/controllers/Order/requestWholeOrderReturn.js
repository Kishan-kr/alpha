// NOT IN USE

const Order = require("../../models/order");
const Rma = require("../../models/rma");
const CustomError = require("../../utils/customError");
const { INTERNAL_SERVER_ERROR } = require("../../utils/constants");
const { canReturnWholeOrder } = require("../../services/orderRules");

module.exports = async function requestWholeOrderReturn(req, res) {
  try {
    const userId = req.user.id;
    const { orderId } = req.params;
    const { reason } = req.body || {};

    if (!orderId) throw new CustomError("Order ID is required", 400);
    if (!reason) throw new CustomError("Reason is required", 400);

    const order = await Order.findOne({ _id: orderId, userId });
    if (!order) throw new CustomError("Order not found", 404);

    if (!canReturnWholeOrder(order)) {
      throw new CustomError("Whole order return not eligible", 400);
    }

    const rma = await Rma.create({
      type: "RETURN",
      scope: "ORDER",
      orderId: order._id,
      reason,
    });

    order.status = "RETURN_FLOW";
    order.items.forEach((i) => { i.status = "RETURN_REQUESTED"; });
    await order.save();

    return res.status(201).json({
      status: true,
      message: "Whole order return requested successfully",
      rma,
    });
  } catch (error) {
    console.error("Whole order return error:", error.message);
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      status: false,
      error: error.message || INTERNAL_SERVER_ERROR,
    });
  }
};