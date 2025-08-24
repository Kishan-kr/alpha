const mongoose = require("mongoose");
const { RMA_TYPES, RMA_SCOPES, RMA_SCOPE, RMA_STATUSES, RMA_STATUS } = require("../utils/enums");
const { Schema } = mongoose;

const RmaSchema = new Schema(
  {
    type: { type: String, enum: RMA_TYPES, required: true },
    scope: { type: String, enum: RMA_SCOPES, default: RMA_SCOPE.ITEM },
    orderId: { type: Schema.Types.ObjectId, ref: "Order"},
    originalOrderId: { type: Schema.Types.ObjectId, ref: "Order", index: true }, // helpful pointer
    userId: { type: Schema.Types.ObjectId, ref: "USER", required: true, index: true },
    itemId: { type: Schema.Types.ObjectId }, // required for ITEM
    reason: { type: String },
    status: { type: String, enum: RMA_STATUSES, default: RMA_STATUS.REQUESTED },
    notes: { type: String },

    // optional exchange details (requested variant)
    exchange: {
      size: String,
      color: String,
      sku: String,
      replacementOrderId: { type: Schema.Types.ObjectId, ref: "Order" },
    },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

module.exports = mongoose.model("Rma", RmaSchema);