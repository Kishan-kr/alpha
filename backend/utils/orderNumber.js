// Format: [prefix][yyy][seq4]  → e.g., "NW0250001"
// - yyy = last 2 digits of year, padded to 3 (2025 → "025")
// - seq4 = per-(prefix, year) counter, zero-padded to 4, resets each year.

const Counter = require("../models/counter");
const { ORDER_NUMBER_PREFIX } = require("./constants");
const { ORDER_TYPE } = require("./enums");

/** Return "yyy" where yyy = (year % 100) padded to 3, e.g., 2025 -> "025" */
function yearFragment(d = new Date()) {
  return String(d.getFullYear() % 100).padStart(3, "0");
}

/** Build the counter key for this prefix+year (so counters reset yearly) */
function counterKey(prefix, yyy) {
  return `${prefix}-${yyy}`; // stored in DB; change shape if you prefer
}

/**
 * Atomically increments and returns the next order number for a given order type.
 * Example: nextOrderNumber(ORDER_TYPE.NEW) -> "NW0250001"
 * @param {"NEW"|"RETURN"|"EXCHANGE"} type
 * @param {Date} [now]
 * @returns {Promise<string>}
 */
async function nextOrderNumber(type = ORDER_TYPE.NEW, now = new Date()) {
  const prefix = ORDER_NUMBER_PREFIX[type] || ORDER_NUMBER_PREFIX.NEW;
  const yyy = yearFragment(now);
  const key = counterKey(prefix, yyy);

  const doc = await Counter.findOneAndUpdate(
    { key },
    { $inc: { seq: 1 } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  ).lean();

  const seq4 = String(Number(doc.seq || 1)).padStart(4, "0");
  return `${prefix}${yyy}${seq4}`;
}

/**
 * Format without incrementing (useful for previews/tests).
 * @param {"NEW"|"RETURN"|"EXCHANGE"} type
 * @param {number} seq
 * @param {Date} [now]
 * @returns {string}
 */
function formatOrderNumber(type = ORDER_TYPE.NEW, seq = 1, now = new Date()) {
  const prefix = ORDER_NUMBER_PREFIX[type] || ORDER_NUMBER_PREFIX.NEW;
  const yyy = yearFragment(now);
  const seq4 = String(seq).padStart(4, "0");
  return `${prefix}${yyy}${seq4}`;
}

module.exports = {
  nextOrderNumber,
  formatOrderNumber,
  yearFragment,
};