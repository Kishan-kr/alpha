const mongoose = require("mongoose");
const addressSchema = require("./address");
const { PAYMENT_STATUSES, PAYMENT_METHODS, CURRENCIES, ORDER_ITEM_STATUSES, ORDER_TYPES, ORDER_TYPE, ORDER_STATUSES, ORDER_STATUS, PAYMENT_STATUS, CURRENCY } = require("../utils/enums");
const { Schema } = mongoose;

/** --- Sub Schemas --- **/

const OrderItemSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    title: { type: String, required: true },
    size: { type: String },
    color: { type: String },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
    subtotal: { type: Number, required: true, min: 0 },
    // RMA-centric item states per your spec:
    status: {
      type: String,
      enum: ORDER_ITEM_STATUSES,
      default: undefined,
    },
    // Needed to enforce 3-day window
    deliveredAt: { type: Date },
    // Optional pointers if you keep variants
    variantId: { type: String },
    sku: { type: String },
    thumbnail: { type: String },
  },
  { _id: true }
);

const PaymentSchema = new Schema(
  {
    method: {
      type: String,
      enum: PAYMENT_METHODS,
      required: true,
    },
    status: {
      type: String,
      enum: PAYMENT_STATUSES,
      default: PAYMENT_STATUS.PENDING,
    },
    amount: { type: Number, required: true, min: 0 },
    transactionId: { type: String }, // razorpay_payment_id
    razorpay_order_id: { type: String },
    razorpay_signature: { type: String },
    currency: {
      type: String,
      enum: CURRENCIES,
      default: CURRENCY.INR,
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date },
  },
  { _id: false }
);

const ShipmentCheckpointSchema = new Schema(
  {
    status: { type: String, required: true },
    at: { type: Date, required: true },
    note: { type: String },
  },
  { _id: false }
);

const ShipmentSchema = new Schema(
  {
    carrier: { type: String },
    trackingNumber: { type: String },
    status: { type: String }, // your free-form status list
    checkpoints: [ShipmentCheckpointSchema],
  },
  { _id: false }
);

/** --- Order Schema --- **/

const OrderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "USER", required: true, index: true },
    orderNumber: { type: String, required: true, unique: true, index: true },

    originalOrderId: { type: Schema.Types.ObjectId, ref: "Order", default: null }, // present for RETURN/EXCHANGE orders
    rmaId: { type: Schema.Types.ObjectId, ref: "Rma", default: null },

    type: {
      type: String,
      enum: ORDER_TYPES,
      default: ORDER_TYPE.NEW,
      index: true,
    },

    items: { type: [OrderItemSchema], default: [] },

    totals: {
      itemsTotal: { type: Number, required: true, min: 0 },
      shippingFee: { type: Number, required: true, min: 0 },
      discount: { type: Number, required: true, min: 0 },
      grandTotal: { type: Number, required: true, min: 0 },
    },

    status: {
      type: String,
      enum: ORDER_STATUSES,
      default: ORDER_STATUS.PENDING,
      index: true,
    },

    payment: { type: PaymentSchema, required: true },
    shipping: { type: ShipmentSchema, default: {} },
    address: { type: addressSchema, _id: false },

    placedAt: { type: Date, default: Date.now },
    cancelledAt: { type: Date },
    deliveredAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);