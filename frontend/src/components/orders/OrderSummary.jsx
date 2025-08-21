import React from "react";
import { formatINR } from "../../utils/dateFormatter";

/**
 * OrderSummary
 * Minimal charges breakdown using your palette.
 *
 * Props:
 *  - totals: {
 *      itemsTotal: number,
 *      shippingFee: number,
 *      discount: number,
 *      grandTotal: number
 *    }
 */
export default function OrderSummary({ totals = {} }) {
  const itemsTotal = Number(totals.itemsTotal ?? 0);
  const shippingFee = Number(totals.shippingFee ?? 0);
  const discount = Number(totals.discount ?? 0);
  const grandTotal =
    totals.grandTotal != null
      ? Number(totals.grandTotal)
      : itemsTotal + shippingFee - discount;

  return (
    <section className="border border-hover-tint bg-light">
      <div className="px-5 py-4 md:px-6 border-b border-hover-tint text-sm uppercase text-dark">
        Order Summary
      </div>
      <div className="px-5 md:px-6 py-5 text-sm">
        <div className="flex items-center justify-between text-subtext">
          <span>Items Total</span>
          <span>₹ {formatINR(itemsTotal)}</span>
        </div>

        <div className="mt-3 flex items-center justify-between text-subtext">
          <span>Delivery Fee</span>
          <span>{shippingFee > 0 ? `₹ ${formatINR(shippingFee)}` : "Free"}</span>
        </div>

        <div className="mt-3 flex items-center justify-between text-subtext">
          <span>Discount</span>
          <span>-₹ {formatINR(discount)}</span>
        </div>

        <div className="mt-5 h-px bg-dark/10" />

        <div className="mt-5 flex items-center justify-between text-dark">
          <span className="uppercase">Total</span>
          <span className="text-base">₹ {formatINR(grandTotal)}</span>
        </div>
        <div className="mt-1 text-xxs text-subtext">Including GST</div>
      </div>
    </section>
  );
}