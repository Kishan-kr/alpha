const mongoose = require("mongoose");
const { Schema } = mongoose;

/**
 * Generic counter/sequence store.
 * One document per key (e.g., "NW", "RT", "EX").
 * `seq` holds the last issued integer for that key.
 */
const CounterSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, index: true }, // e.g., "NW"
    seq: { type: Number, required: true, default: 0 },                // last issued number
  },
  { timestamps: true }
);

module.exports = mongoose.model("Counter", CounterSchema);