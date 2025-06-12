const mongoose = require('mongoose');
const { orderStatuses, currencies } = require('../utilis/enums');
const addressSchema = require('./address');

const orderSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'USER',
    required: true
  },
  shippingAddress: {
    type: addressSchema,
    required: true
  },

  subtotal: {
    type: Number,
    required: true
  },        // Before discount/tax
  discount: Number,
  tax: Number,
  totalAmount: Number,  // subtotal - discount + tax
  deliveryFee: Number,
  currency: { 
    type: String, 
    enum: currencies, 
    default: "INR" 
  },
  orderStatus: {
    type: String,
    enum: orderStatuses,
    default: 'pending'
  },
  orderNumber:{
    type:Number,
    required:true
  },
  cancelledAt: Date,  // required only if status is cancelled
}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;