// Allowed status transitions per order.type
// Keep this tiny and explicit so ops rules stay auditable.

const { ORDER_TYPE, ORDER_STATUS } = require("./enums");

// Helper to freeze deep
const freeze = (o) => Object.freeze(JSON.parse(JSON.stringify(o)));

const TRANSITIONS = {
  [ORDER_TYPE.NEW]: {
    [ORDER_STATUS.PENDING]:           [ORDER_STATUS.CONFIRMED, ORDER_STATUS.CANCELLED],
    [ORDER_STATUS.CONFIRMED]:         [ORDER_STATUS.SHIPPED, ORDER_STATUS.CANCELLED],
    [ORDER_STATUS.SHIPPED]:           [ORDER_STATUS.OUT_FOR_DELIVERY],
    [ORDER_STATUS.OUT_FOR_DELIVERY]:  [ORDER_STATUS.DELIVERED],
    [ORDER_STATUS.DELIVERED]:         [],                     // terminal for NEW
    [ORDER_STATUS.CANCELLED]:         [],                     // terminal
  },

  // Replacement flow
  [ORDER_TYPE.EXCHANGE]: {
    [ORDER_STATUS.EXCHANGE_REQUESTED]: [ORDER_STATUS.SHIPPED, ORDER_STATUS.CANCELLED, ORDER_STATUS.EXCHANGE_REJECTED],
    [ORDER_STATUS.SHIPPED]:            [ORDER_STATUS.OUT_FOR_DELIVERY],
    [ORDER_STATUS.OUT_FOR_DELIVERY]:   [ORDER_STATUS.DELIVERED],
    [ORDER_STATUS.DELIVERED]:          [],                    // terminal
    [ORDER_STATUS.CANCELLED]:          [],                    // terminal
    [ORDER_STATUS.EXCHANGE_REJECTED]:  [],                    // terminal
  },

  // Return flow (pickup → received → completed) or rejection
  [ORDER_TYPE.RETURN]: {
    [ORDER_STATUS.RETURN_REQUESTED]: [ORDER_STATUS.PICKED_UP, ORDER_STATUS.RETURN_REJECTED, ORDER_STATUS.CANCELLED],
    [ORDER_STATUS.PICKED_UP]:        [ORDER_STATUS.RECEIVED],
    [ORDER_STATUS.RECEIVED]:         [ORDER_STATUS.RETURN_COMPLETED],
    [ORDER_STATUS.RETURN_COMPLETED]: [],
    [ORDER_STATUS.RETURN_REJECTED]:  [],
    [ORDER_STATUS.CANCELLED]:        [],
  },
};

// Validate a transition
function canTransition(type, from, to) {
  const map = TRANSITIONS[type] || {};
  const allowed = map[from] || [];
  return allowed.includes(to);
}

module.exports = {
  TRANSITIONS: freeze(TRANSITIONS),
  canTransition,
};