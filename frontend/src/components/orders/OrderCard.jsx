import React from "react";
import { productStatusBgStyles, productStatusStyles } from "../../constants/styleMaps";
import { orderStatusValues } from "../../constants/valueMaps";

export default function ProductCard({ 
  product, 
  orderStatus, 
  showReturn = false,
  showExchange = false,
  handleReturn = () => {}, 
  handleExchange = () => {}, 
 }) {
  const {
    productId,
    size,
    quantity,
    discountedPrice,
    originalPrice,
    status,
    isReturned,
    returnInfo,
    isExchangeItem,
    exchangeStatus
  } = product;

  const shouldShowStatus =
    ['exchanged', 'returned'].includes(status) &&
    orderStatus !== status;

  return (
    <div className="flex relative gap-4 p-4 rounded-lg shadow-sm bg-surface border border-light/10">
      <img
        src={productId.thumbnail}
        alt={productId.title}
        className="w-20 h-20 object-cover rounded"
      />

      <div className="flex-1">
        <h2 className="font-semibold">{productId.title}</h2>
        <p className="text-sm text-subtext">
          Size: {size} | Qty: {quantity}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-dark font-bold">₹{discountedPrice}</span>
          {originalPrice !== discountedPrice && (
            <span className="line-through text-subtext text-sm">
              ₹{originalPrice}
            </span>
          )}
        </div>

        {shouldShowStatus && (
          <p
            className={`
              text-xs mt-1 p-0.5 px-3 rounded absolute -top-3 right-2
              ${productStatusBgStyles[status]}
              ${productStatusStyles[status]}
            `}
          >
            {orderStatusValues[status]}
          </p>
        )}

        {(
          <div className="mt-1 text-xs text-subtext">
            {showReturn && (
              <button className="">
                Return
              </button>
            )}
            {showExchange && (
              <button className="">Exchange</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}