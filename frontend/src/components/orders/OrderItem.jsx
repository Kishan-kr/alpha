import React from "react";
import {
  formatINR,
} from "../../utils/dateFormatter";

/**
 * OrderItem
 * - 2/3 image ratio (consistent with bag)
 * - Minimal, no rounded corners, generous spacing
 * - Return/Exchange enabled only if item is DELIVERED and within 3 days
 *
 * Props:
 *  - item: order item object
 *  - actionLoading: boolean (disables buttons while processing)
 *  - onReturn: (itemId) => void
 *  - onExchange: (item) => void
 */
export default function OrderItem({ item, actionLoading, canReturn, canExchange, onReturn, onExchange }) {
  const unitOrSubtotal = Number(item?.subtotal ?? item?.price ?? 0);

  return (
    <div className="py-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:gap-6 md:gap-12">
        {/* Thumb (2/3 ratio) */}
        <figure className="w-28 min-w-24 xxs:w-32 xxs:min-w-28 md:w-40 md:min-w-40 aspect-[2/3] bg-surface overflow-hidden">
          {item?.thumbnail ? (
            <img
              src={item.thumbnail}
              alt={item.title || "Product"}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : null}
        </figure>

        {/* Content */}
        <div className="flex-1">
          <h4 className="text-dark uppercase text-sm md:text-base">{item?.title}</h4>

          {/* Color */}
          {item?.color && (
            <p className="text-xs text-subtext uppercase mt-1">
              {String(item.color).toUpperCase()}
            </p>
          )}

          <p className="text-xs text-subtext uppercase mt-2">
            Size: {item?.size || "-"} &nbsp;|&nbsp; Qty: {item?.quantity ?? 1}
          </p>

          {/* Deadline (show only when delivered) */}
          {/* {delivered && deadline && (
            <p className="text-xxs text-subtext uppercase mt-1">
              Return/Exchange until: {formatDateTime(deadline)}
            </p>
          )} */}

          {/* Price */}
          <div className="mt-5 flex items-baseline gap-2">
            <span className="text-dark text-[10px] xxs:text-xs uppercase">
              ₹ {formatINR(unitOrSubtotal)}
            </span>
          </div>

          {/* Item status (only if it exists) */}
          {item?.status && (
            <div className="mt-2 flex items-center gap-2 text-xxs uppercase text-subtext">
              <span
                className={`inline-block w-2 h-2 rounded-full ${{
                  RETURN_REQUESTED: "bg-amber-500",
                  RETURN_REJECTED: "bg-red-500",
                  EXCHANGE_REQUESTED: "bg-teal-500",
                  EXCHANGE_REJECTED: "bg-red-500",
                  EXCHANGE_DELIVERED: "bg-green-500",
                  RETURNED: "bg-emerald-500"
                }[String(item.status).toUpperCase()] || "bg-gray-400"
                  }`}
              />
              <span>{String(item.status).replace(/_/g, " ")}</span>
            </div>
          )}

          {/* Actions (respect 3-day window & delivered) */}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => onReturn(item._id)}
              disabled={!canReturn || actionLoading}
              className={`uppercase text-xs px-4 py-2 border enabled:cursor-pointer ${canReturn && !actionLoading
                ? "border-dark text-dark hover:bg-surface"
                : "border-hover-tint text-hover-tint"
                }`}
            >
              {actionLoading ? "Processing…" : "Return"}
            </button>

            <button
              onClick={() => onExchange(item)}
              disabled={!canExchange || actionLoading}
              className={`uppercase text-xs px-4 py-2 border enabled:cursor-pointer ${canExchange && !actionLoading
                ? "border-dark text-dark hover:bg-surface"
                : "border-hover-tint text-hover-tint"
                }`}
            >
              {actionLoading ? "Processing…" : "Exchange"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}