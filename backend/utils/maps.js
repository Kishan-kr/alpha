const { PAYMENT_METHOD, PAYMENT_STATUS } = require("./enums");

const sortOrderMap = {
  'asc': 1,
  'desc': -1
}

const validProductSortFields = [
  'createdAt', 
  'title', 
  'effectivePrice', 
]

// ---- Razorpay method mapping helper ----
function mapRazorpayMethod(method) {
  switch (String(method).toLowerCase()) {
    case "upi":
      return PAYMENT_METHOD.UPI;
    case "card":
      return PAYMENT_METHOD.CARD;
    case "netbanking":
      return PAYMENT_METHOD.NETBANKING;
    case "wallet":
      return PAYMENT_METHOD.WALLET;
    case "cod":
      return PAYMENT_METHOD.COD;
    default:
      return method ? method.toUpperCase() : PAYMENT_METHOD.CARD; // fallback
  }
}


// ---- Razorpay payment status mapping helper ----
function mapRazorpayPaymentStatus(razorpayStatus) {
  switch (String(razorpayStatus).toLowerCase()) {
    case "created":
      return PAYMENT_STATUS.PENDING;
    case "authorized":
      return PAYMENT_STATUS.PENDING;
    case "captured":
      return PAYMENT_STATUS.PAID;
    case "failed":
      return PAYMENT_STATUS.FAILED;
    case "refunded":
      return PAYMENT_STATUS.REFUNDED;
    default:
      return PAYMENT_STATUS.PENDING;
  }
}

module.exports = {
  sortOrderMap,
  validProductSortFields,
  mapRazorpayMethod,
  mapRazorpayPaymentStatus,
}