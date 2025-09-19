
const countries = [
  "India"
]

const paymentGateways = [
  'razorpay',
  'stripe',
  'cashfree',
  'paypal'
]

// ---- Order types ----
const ORDER_TYPE = Object.freeze({
  NEW: "NEW",
  RETURN: "RETURN",
  EXCHANGE: "EXCHANGE",
});
const ORDER_TYPES = Object.freeze(Object.values(ORDER_TYPE));

// ---- Order status (as per your Order schema) ----
const ORDER_STATUS = Object.freeze({
  INITIATED: "INITIATED",
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  SHIPPED: "SHIPPED",
  OUT_FOR_DELIVERY: "OUT_FOR_DELIVERY",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
  RETURN_REQUESTED: "RETURN_REQUESTED",
  PICKED_UP: "PICKED_UP",
  RECEIVED: "RECEIVED",
  RETURN_COMPLETED: "RETURN_COMPLETED",
  RETURN_REJECTED: "RETURN_REJECTED",
  EXCHANGE_REJECTED: "EXCHANGE_REJECTED",
  EXCHANGE_REQUESTED: "EXCHANGE_REQUESTED",
  ABANDONED: "ABANDONED",
});
const ORDER_STATUSES = Object.freeze(Object.values(ORDER_STATUS));

// ---- Order item status (as per your Item schema) ----
const ORDER_ITEM_STATUS = Object.freeze({
  RETURN_REQUESTED: "RETURN_REQUESTED",
  RETURN_REJECTED: "RETURN_REJECTED",
  EXCHANGE_REQUESTED: "EXCHANGE_REQUESTED",
  EXCHANGE_REJECTED: "EXCHANGE_REJECTED",
  EXCHANGE_DELIVERED: "EXCHANGE_DELIVERED",
  RETURNED: "RETURNED",
});
const ORDER_ITEM_STATUSES = Object.freeze(Object.values(ORDER_ITEM_STATUS));

// ---- Payment method ----
const PAYMENT_METHOD = Object.freeze({
  COD: "COD",
  CARD: "CARD",
  UPI: "UPI",
  NETBANKING: "NETBANKING",
  WALLET: "WALLET",
  NONE: "NONE",
});
const PAYMENT_METHODS = Object.freeze(Object.values(PAYMENT_METHOD));

// ---- Payment status (exactly as in your schema) ----
const PAYMENT_STATUS = Object.freeze({
  PENDING: "PENDING",
  PAID: "PAID",
  REFUND_PENDING: "REFUND_PENDING",
  REFUNDED: "REFUNDED",
  PARTIALLY_REFUNDED: "PARTIALLY_REFUNDED",
  FAILED: "FAILED",
  REFUND_FAILED: "REFUND_FAILED",
  NOT_COLLECTED: "NOT_COLLECTED", // for cancelled COD
  REFUND_CANCELLED: "REFUND_CANCELLED",
});
const PAYMENT_STATUSES = Object.freeze(Object.values(PAYMENT_STATUS));

// ---- Currency (you currently use INR) ----
const CURRENCY = Object.freeze({ INR: "INR" });
const CURRENCIES = Object.freeze(Object.values(CURRENCY));

// ---- RMA enums ----
const RMA_TYPE = Object.freeze({
  RETURN: "RETURN",
  EXCHANGE: "EXCHANGE",
});
const RMA_TYPES = Object.freeze(Object.values(RMA_TYPE));

const RMA_SCOPE = Object.freeze({
  ORDER: "ORDER", // kept for compatibility; you’re using ITEM for returns/exchanges
  ITEM: "ITEM",
});
const RMA_SCOPES = Object.freeze(Object.values(RMA_SCOPE));

const RMA_STATUS = Object.freeze({
  REQUESTED: "REQUESTED",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  CLOSED: "CLOSED",
});
const RMA_STATUSES = Object.freeze(Object.values(RMA_STATUS));

// ---- Shipment (not strict in schema, but canonical set for consistency) ----
const SHIPMENT_STATUS = Object.freeze({
  CREATED: "CREATED",
  IN_TRANSIT: "IN_TRANSIT",
  OUT_FOR_DELIVERY: "OUT_FOR_DELIVERY",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
  RTO: "RTO",
});
const SHIPMENT_STATUSES = Object.freeze(Object.values(SHIPMENT_STATUS));

module.exports = {
  countries,
  paymentGateways,
  ORDER_TYPE,
  ORDER_TYPES,
  ORDER_STATUS,
  ORDER_STATUSES,
  ORDER_ITEM_STATUS,
  ORDER_ITEM_STATUSES,
  PAYMENT_METHOD,
  PAYMENT_METHODS,
  PAYMENT_STATUS,
  PAYMENT_STATUSES,
  CURRENCY,
  CURRENCIES,
  RMA_TYPE,
  RMA_TYPES,
  RMA_SCOPE,
  RMA_SCOPES,
  RMA_STATUS,
  RMA_STATUSES,
  SHIPMENT_STATUS,
  SHIPMENT_STATUSES,
};