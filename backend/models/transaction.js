const mongoose = require('mongoose');
const { 
  transactionTypes, 
  paymentMethods, 
  paymentGateways, 
  currencies, 
  paymentStatuses 
} = require('../utilis/enums');

const transactionSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'USER',
    required: true
  },
  transactionType: {
    type: String,
    enum: transactionTypes,
    required: true
  },
  method: {
    type: String,
    enum: paymentMethods,
    required: true
  },
  gateway: {
    type: String,
    enum: paymentGateways,
    required: true,
    default:"*"
  },
  transactionId: {
    type: String,
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    enum: currencies,
    default: 'INR'
  },
  status: {
    type: String,
    enum: paymentStatuses,
    required: true
  },

  refundedItemId: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'OrderedProduct'
  }]      // optional
}, {
  timestamps: true
});

module.exports = mongoose.model('Transaction', transactionSchema);