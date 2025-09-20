const Order = require("../../models/order");
const Rma = require("../../models/rma");
const CustomError = require("../../utils/customError");
const { INTERNAL_SERVER_ERROR } = require("../../utils/constants");
const { ORDER_STATUS } = require("../../utils/enums");

/**
 * GET /api/orders (for users only)
 * Query:
 *  - page (default 1)
 *  - limit (default 10, max 50)
 *  - status (optional) -> filters order.status
 *  - type   (optional) -> filters NEW | RETURN | EXCHANGE
 *  - q      (optional) -> partial match on orderNumber
 *  - withRma=1 (optional) -> attach minimal RMA object if rmaId present
 *
 * Returns minimal fields needed for the Orders list page,
 * sorted by placedAt (desc), then createdAt (desc).
 */
module.exports = async (req, res) => {
  try {
    const userId = req.user.id;

    // pagination & filters
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 50);
    const { status, type, q, withRma } = req.query || {};

    const filter = { userId };

    // Always exclude ABANDONED and INITIATED orders
    filter.status = { $nin: [ORDER_STATUS.ABANDONED, ORDER_STATUS.INITIATED] };
    if (status && Array.isArray(status)) {
      filter.status.$in = status;
    } else if (status) {
      filter.status.$in = [status];
    }

    if (type) filter.type = type;
    if (q) filter.orderNumber = { $regex: q.trim(), $options: "i" };

    // fields to return (keep list page light)
    const projection = {
      orderNumber: 1,
      type: 1,
      status: 1,
      placedAt: 1,
      deliveredAt: 1,
      cancelledAt: 1,
      originalOrderId: 1,
      rmaId: 1,
      totals: 1,
      // item preview fields used in the card
      "items._id": 1,
      "items.title": 1,
      "items.size": 1,
      "items.color": 1,
      "items.quantity": 1,
      "items.price": 1,
      "items.subtotal": 1,
      "items.thumbnail": 1,
      "items.status": 1,
    };

    const [total, orders] = await Promise.all([
      Order.countDocuments(filter),
      Order.find(filter)
        .select(projection)
        .sort({ placedAt: -1, createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()
    ]);

    // optionally attach minimal RMA details for cards (REQUESTED/REJECTED, reason)
    if (withRma === "1" || withRma === 1) {
      const rmaIds = orders.filter(o => o.rmaId).map(o => o.rmaId);
      if (rmaIds.length) {
        const rmas = await Rma.find({ _id: { $in: rmaIds } })
          .select({ status: 1, type: 1, reason: 1, itemId: 1, createdAt: 1, updatedAt: 1 })
          .lean();
        const byId = new Map(rmas.map(r => [String(r._id), r]));
        orders.forEach(o => {
          if (o.rmaId && byId.has(String(o.rmaId))) {
            o.rma = byId.get(String(o.rmaId));
          }
        });
      }
    }

    return res.status(200).json({
      status: true,
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(Math.ceil(total / limit), 1),
      },
    });
  } catch (error) {
    console.error("Get orders by user error:", error.message);
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      status: false,
      error: error.message || INTERNAL_SERVER_ERROR,
    });
  }
};