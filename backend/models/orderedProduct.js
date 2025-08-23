const mongoose = require('mongoose');
const { productOrderStatuses } = require('../utils/enums');

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
    enum: productOrderStatuses,
    default: 'pending'
  },
  isExchangeItem: { type: Boolean, default: false },
  exchangedFrom: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'ExchangeRequest' 
  }     // this is for exchange item only
}, { timestamps: true });

const OrderedProduct = mongoose.model("OrderedProduct", orderedProductSchema);
module.exports = OrderedProduct;