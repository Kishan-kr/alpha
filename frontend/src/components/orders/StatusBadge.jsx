/* StatusPill.jsx
 * Elegant sequential status colors
 * Usage: <StatusPill status={order.status} />
 */
import React from "react";

const palette = {
  // Order flow (sequential blues → green)
  PENDING: "bg-blue-50 text-blue-700 border-blue-200",          // light blue = waiting
  CONFIRMED: "bg-sky-50 text-sky-700 border-sky-200",          // slightly brighter blue
  SHIPPED: "bg-indigo-50 text-indigo-700 border-indigo-200",   // deeper progress tone
  OUT_FOR_DELIVERY: "bg-violet-50 text-violet-700 border-violet-200", // heading to customer
  DELIVERED: "bg-green-50 text-green-700 border-green-200",    // success = green

  // Terminal negative states
  CANCELLED: "bg-gray-100 text-gray-600 border-gray-200",      // neutral gray
  RETURN_REJECTED: "bg-red-50 text-red-700 border-red-200",    // rejection = red
  EXCHANGE_REJECTED: "bg-red-50 text-red-700 border-red-200",  // rejection = red

  // Return & Exchange flow
  RETURN_REQUESTED: "bg-amber-50 text-amber-700 border-amber-200",    // request = amber
  PICKED_UP: "bg-yellow-50 text-yellow-700 border-yellow-200",        // item collected
  RECEIVED: "bg-lime-50 text-lime-700 border-lime-200",               // warehouse received
  RETURN_COMPLETED: "bg-emerald-50 text-emerald-700 border-emerald-200", // successfully returned

  EXCHANGE_REQUESTED: "bg-amber-50 text-amber-700 border-amber-200",     // request = amber
};

export default function StatusPill({ status = "", className = "" }) {
  const key = String(status || "").toUpperCase();
  const color = palette[key] || "bg-gray-50 text-gray-700 border-gray-200";

  return (
    <span
      className={`inline-flex items-center border px-2 py-0.5 text-xs font-medium ${color} ${className}`}
      title={key}
    >
      {key.replace(/_/g, " ")}
    </span>
  );
}