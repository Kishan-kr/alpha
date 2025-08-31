import React from "react";
import { formatINR } from "../../utils/dateFormatter";
import ResponsiveImage from "../common/ResponsiveImage";


export default function OrderItemRow({ item }) {
  // Prefer subtotal for display; fall back to price
  const effective = Number(item?.subtotal ?? item?.price ?? 0);

  return (
    <div className="py-5 md:py-7">
      <div className="flex gap-4 xxs:gap-6 md:gap-12">
        {/* Thumbnail placeholder or image */}
        {/* <figure className="w-28 min-w-28 md:w-32 md:min-w-32 aspect-[2/3] bg-surface overflow-hidden">
          {item?.thumbnail ? (
            <img src={item.thumbnail} alt={item.title} className="h-full w-full object-cover" />
          ) : null}
        </figure> */}

        <figure className="w-28 min-w-28 md:w-32 md:min-w-32 aspect-[2/3] bg-surface overflow-hidden">
          {item?.thumbnail ? (
            <ResponsiveImage
              source={item.thumbnail}      // DB-stored single URL
              alt={item.title}
              className="h-full w-full object-cover"
              variants={["thumb"]}    // strictly thumbnail only
              sizes="33vw"            // small card; override as you like
              defaultVariant="thumb"  // use the tiny file as <img src>
            />
          ) : null}
        </figure>

        {/* Content */}
        <div className="flex-1 font-light">
          <h4 className="text-dark uppercase text-sm md:text-base">{item?.title}</h4>

          {/* Color on its own line */}
          {item?.color && (
            <p className="text-xs text-subtext uppercase mt-1">
              {String(item.color).toUpperCase()}
            </p>
          )}

          {/* size and quantity */}
          <p className="text-xs text-subtext uppercase mt-2">
            Size: {item?.size || "-"} &nbsp;|&nbsp; Qty: {item?.quantity ?? 1}
          </p>


          {/* Price */}
          <div className="mt-5 flex items-baseline gap-2">
            <span className="text-dark text-[10px] xxs:text-xs uppercase">
              ₹ {formatINR(effective)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}