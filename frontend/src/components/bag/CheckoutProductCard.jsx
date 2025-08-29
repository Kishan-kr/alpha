// src/components/bag/CheckoutProductCard.jsx
import React from "react";

const CheckoutProductCard = ({ product }) => {
  const price = Number(product?.effectivePrice ?? product?.originalPrice ?? 0);
  const qty = Number(product?.quantity ?? 1);
  const size = product?.size ?? product?.selectedSize ?? "-";
  const color = product?.color;
  const title = product?.title?.length >= 32 ? product.title.trim().slice(0, 30) + '...' : product?.title;

  return (
    <div className="flex gap-4 items-center border border-hover-tint p-4 bg-light text-dark">
      <img
        src={product?.thumbnail}
        alt={product?.title || "Product"}
        className="w-20 h-20 object-cover bg-surface"
      />

      <div className="flex justify-between flex-grow gap-4">
        <div className="min-w-0">
          <h3 className="text-sm uppercase text-dark">{title}</h3>
          <p className="text-xs text-subtext">
            {product?.category}
            {color ? ` • ${color}` : ""}
          </p>

          <div className="flex gap-2 mt-2">
            <p className="text-xs text-dark bg-surface px-2 py-1">
              <span className="text-subtext mr-1">Qty</span>
              {qty}
            </p>
            {size && size !== "-" && (
              <p className="text-xs text-dark bg-surface px-2 py-1">{size}</p>
            )}
          </div>
        </div>

        <p className="text-dark font-medium self-end whitespace-nowrap">
          ₹ {price.toLocaleString("en-IN")}
        </p>
      </div>
    </div>
  );
};

export default CheckoutProductCard;