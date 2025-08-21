
/* StatusPill.jsx
* Small badge for order/item statuses
* Usage: <StatusPill status={order.status} />
*/
import React from "react";

const palette = {
  // Order-level
  PENDING_PAYMENT: "bg-yellow-50 text-yellow-700 border-yellow-200",
  CONFIRMED: "bg-blue-50 text-blue-700 border-blue-200",
  PROCESSING: "bg-blue-50 text-blue-700 border-blue-200",
  PACKED: "bg-indigo-50 text-indigo-700 border-indigo-200",
  SHIPPED: "bg-sky-50 text-sky-700 border-sky-200",
  DELIVERED: "bg-green-50 text-green-700 border-green-200",
  CANCELLED: "bg-gray-100 text-gray-600 border-gray-200",
  RETURN_FLOW: "bg-amber-50 text-amber-700 border-amber-200",
  EXCHANGE_FLOW: "bg-purple-50 text-purple-700 border-purple-200",
  REFUNDED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  PARTIALLY_REFUNDED: "bg-emerald-50 text-emerald-700 border-emerald-200",

  // Item-level
  ORDERED: "bg-blue-50 text-blue-700 border-blue-200",
  RETURN_REQUESTED: "bg-amber-50 text-amber-700 border-amber-200",
  RETURNED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  EXCHANGE_REQUESTED: "bg-purple-50 text-purple-700 border-purple-200",
  EXCHANGED: "bg-purple-50 text-purple-700 border-purple-200",
  LOCKED: "bg-gray-100 text-gray-600 border-gray-200",
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

/* Compact status indicator: colored dot + uppercase label.
   Uses your pigment-green for DELIVERED and neutral tones elsewhere. */

const map = {
  DELIVERED: { dot: "bg-pigment-green", text: "Delivered" },
  SHIPPED: { dot: "bg-dark", text: "Shipped" },
  PACKED: { dot: "bg-dark", text: "Packed" },
  PROCESSING: { dot: "bg-dark", text: "Processing" },
  CONFIRMED: { dot: "bg-dark", text: "Confirmed" },
  PENDING_PAYMENT: { dot: "bg-dark", text: "Pending Payment" },
  CANCELLED: { dot: "bg-subtext", text: "Cancelled" },
  RETURN_FLOW: { dot: "bg-subtext", text: "Return In Progress" },
  EXCHANGE_FLOW: { dot: "bg-subtext", text: "Exchange In Progress" },
  REFUNDED: { dot: "bg-subtext", text: "Refunded" },
};

// export default function StatusDot({ status }) {
//   const key = String(status || "").toUpperCase();
//   const conf = map[key] || { dot: "bg-subtext", text: key.replace(/_/g, " ") };

//   return (
//     <div className="inline-flex items-center gap-2">
//       <span className={`inline-block h-2 w-2 ${conf.dot}`} />
//       <span className="px-2 py-0.5 text-xs uppercase bg-surface text-dark">
//         {conf.text}
//       </span>
//     </div>
//   );
// }