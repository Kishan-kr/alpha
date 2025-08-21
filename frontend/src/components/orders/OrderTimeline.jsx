import React from "react";
import StatusBadge from "./StatusDot"; // you renamed the component to StatusBadge in this file

// Map statuses to human labels used in the timeline
const LABELS = {
  ORDER_PLACED: "Order placed",
  SHIPPED: "Shipped",
  OUT_FOR_DELIVERY: "Out for delivery",
  DELIVERED: "Delivered",

  EXCHANGE_REQUESTED: "Exchange requested",
  PICKED_UP: "Picked up",
  RECEIVED: "Received",

  RETURN_REQUESTED: "Return requested",
  RETURN_COMPLETED: "Returned",
};

function stepsFor(type) {
  if (type === "EXCHANGE") {
    return ["EXCHANGE_REQUESTED", "PICKED_UP", "RECEIVED", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED"];
  }
  if (type === "RETURN") {
    return ["RETURN_REQUESTED", "PICKED_UP", "RECEIVED", "RETURN_COMPLETED"];
  }
  // NEW
  return ["ORDER_PLACED", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED"];
}

function currentIndex(type, status) {
  const flow = stepsFor(type);
  const idx = flow.indexOf(status);
  if (idx >= 0) return idx;
  // map some aliases
  if (status === "CONFIRMED" || status === "PENDING") return 0;
  if (status === "CANCELLED") return -1; // special
  return 0;
}

const OrderTimeline = ({ type, status, className = "" }) => {
  const flow = stepsFor(type);
  const active = currentIndex(type, status);

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between gap-3">
        {flow.map((code, i) => {
          const done = active > i;
          const isActive = active === i && active !== -1;
          return (
            <div key={code} className="flex-1 flex items-center gap-3">
              <div className="flex flex-col items-center">
                {/* square marker (no roundness) */}
                <div
                  className={`w-3 h-3 ${isActive ? "bg-dark" : done ? "bg-subtext" : "bg-hover-tint"}`}
                />
                <span className="text-xxs uppercase text-subtext mt-2 text-center">{LABELS[code]}</span>
              </div>
              {i < flow.length - 1 && (
                <div className={`h-px flex-1 ${done ? "bg-subtext" : "bg-hover-tint"}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderTimeline;