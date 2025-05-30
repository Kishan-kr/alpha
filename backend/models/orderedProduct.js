const mongoose = require('mongoose');
const { orderStatuses } = require('../utilis/enums');

const orderedProductSchema = mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Order',
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'PRODUCT',
    required: true
  },
  size: {
    type: String,
    required: true
  },
  quantity: Number,
  originalPrice: {
    type: Number,
    required: true
  },
  discountedPrice: Number,
  status: {
    type: String,
    enum: orderStatuses,
    default: 'pending'
  },
  cancelledAt: Date,  // required only if status is cancelled
}, { timestamps: true });

const OrderedProduct = mongoose.model("OrderedProduct", orderedProductSchema);
module.exports = OrderedProduct;