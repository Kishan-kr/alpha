const mongoose = require('mongoose');
const { returnStatuses } = require('../utilis/enums');

const returnRequestSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  orderedProductId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'OrderedProduct',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'USER',
    required: true
  },

  reason: {
    type: String,
    required: true
  },
  comment: {
    type: String
  },

  status: {
    type: String,
    enum: returnStatuses,
    default: 'requested'
  },

  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ADMIN',
  },        // admin who approved the return request

  pickupScheduledAt: {
    type: Date
  },
  pickedUpAt: {
    type: Date
  },
  receivedAtWarehouseAt: {
    type: Date
  },
  refundedAt: {
    type: Date
  },

  images: [String], // URLs of images uploaded by the user
  isOpened: {
    type: Boolean,
    default: false // Whether the return is opened/damaged
  },

  initiatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ReturnRequest', returnRequestSchema);