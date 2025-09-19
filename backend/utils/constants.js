exports.MAX_IMAGE_SIZE = 3 * 1024 * 1024;       // 3MB
exports.SESSION_EXPIRATION_TIME = '7d';
exports.ADMIN_SESSION_EXPIRATION_TIME = '1d';

exports.INTERNAL_SERVER_ERROR = 'Internal Server Error';

// Business rule knobs
exports.RETURN_WINDOW_DAYS = 3;      // item-level returns/exchanges allowed within N days of deliveredAt
exports.CANCEL_WINDOW_HOURS = 24;    // order-level cancellation window from placedAt

// IDs / Numbering (updated)
exports.ORDER_NUMBER_PREFIX = Object.freeze({
  NEW: "NW",
  RETURN: "RT",
  EXCHANGE: "EX",
});

// Finance
exports.DEFAULT_CURRENCY = "INR";

// order received email address
exports.ORDERS_EMAIL_ADDRESS = "orders@tashn.in"

