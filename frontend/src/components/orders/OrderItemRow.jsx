import React from "react";
import { formatINR } from "../../utils/dateFormatter";


export default function OrderItemRow({ item }) {
  // Prefer subtotal for display; fall back to price
  const effective = Number(item?.subtotal ?? item?.price ?? 0);
  // If you pass an original/MRP in your payload, it will render with strikethrough
  const mrp = item?.originalPrice || item?.mrp;

  return (
    <div className="py-5 md:py-7">
      <div className="flex gap-4 xxs:gap-6 md:gap-12">
        {/* Thumbnail placeholder or image */}
        <figure className="w-28 min-w-28 md:w-32 md:min-w-32 aspect-[2/3] bg-surface overflow-hidden">
          {item?.thumbnail ? (
            <img src={item.thumbnail} alt={item.title} className="h-full w-full object-cover" />
          ) : null}
        </figure>

        {/* Content */}
        <div className="flex-1 font-light">
          <h4 className="text-dark uppercase text-sm md:text-base">{item?.title}</h4>
          <p className="text-xs text-subtext uppercase mt-2">
            Size: {item?.size || "-"} &nbsp;|&nbsp; Qty: {item?.quantity ?? 1}
          </p>

          {/* Price */}
          <div className="mt-5 flex items-baseline gap-2">
            {mrp && Number(mrp) !== effective ? (
              <>
                <span className="text-dark bg-accent px-1 text-[10px] xxs:text-xs uppercase">
                  ₹ {formatINR(effective)}
                </span>
                <span className="text-dark text-[10px] xxs:text-xs uppercase line-through">
                  ₹ {formatINR(Number(mrp))}
                </span>
              </>
            ) : (
              <span className="text-dark text-[10px] xxs:text-xs uppercase">
                ₹ {formatINR(effective)}
              </span>
            )}
          </div>

          {/* Item status (optional, small) */}
          {item?.status && (
            <div className="mt-2 text-xxs uppercase text-subtext">Status: {String(item.status).replace(/_/g, " ")}</div>
          )}
        </div>
      </div>
    </div>
  );
}