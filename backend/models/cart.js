const mongoose = require("mongoose");

const cartSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "USER",
      required: true
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PRODUCT",
      required: true
    },
    variantId: String,
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1']
    },
    size: {
      type: String,
      required: true
    },
    color: {
      type: String,
      required: true
    },
    title: String,
    maxStock: Number,
    lasSynced: Date
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("CART", cartSchema);