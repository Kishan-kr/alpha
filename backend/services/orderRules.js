const IN_PROCESS = ["CONFIRMED","PROCESSING","PACKED"];

const canCancelOrder = (order) => {
  if (order.status === "CANCELLED") return false;
  if (!IN_PROCESS.includes(order.status)) return false;
  const anyShippedOrDelivered = order.items.some(i => ["SHIPPED","DELIVERED"].includes(i.status));
  return !anyShippedOrDelivered;
};

const within3Days = (date) => {
  if (!date) return false;
  const MS = 3 * 24 * 60 * 60 * 1000;
  return (Date.now() - new Date(date).getTime()) <= MS;
};

const canReturnItem = (item) =>
  item.status === "DELIVERED" && within3Days(item.deliveredAt);

const canReturnWholeOrder = (order) => {
  const allDelivered = order.items.every(i => i.status === "DELIVERED");
  if (!allDelivered) return false;
  return order.items.every(canReturnItem);
};

const canExchangeItem = (item) =>
  item.status === "DELIVERED" && within3Days(item.deliveredAt);

module.exports = {
  canCancelOrder,
  within3Days,
  canReturnItem,
  canReturnWholeOrder,
  canExchangeItem
};