import React from "react";
import { formatDateShort } from "../../utils/dateFormatter";

/**
 * PaymentInfo
 * Minimal payment block matching your palette.
 *
 * Props:
 *  - payment: {
 *      method?: "COD" | "CARD" | "UPI" | "WALLET",
 *      status?: string,
 *      transactionId?: string,
 *      capturedAt?: string | Date
 *    }
 */
export default function PaymentInfo({ payment = {} }) {
  const method = (payment.method || "—").toString().toUpperCase();
  const status = (payment.status || "—").toString().toUpperCase();

  return (
    <section className="border border-hover-tint bg-light">
      <div className="px-5 py-4 md:px-6 border-b border-hover-tint text-sm uppercase text-dark">
        Payment
      </div>

      <div className="px-5 md:px-6 py-5 text-sm">
        <div className="flex items-center justify-between text-subtext">
          <span>Method</span>
          <span className="uppercase">{method}</span>
        </div>

        <div className="mt-3 flex items-center justify-between text-subtext">
          <span>Status</span>
          <span className="uppercase">{status}</span>
        </div>

        {payment.transactionId && (
          <div className="mt-3 flex items-center justify-between text-subtext">
            <span>Transaction ID</span>
            <span className="truncate max-w-[60%] text-right">
              {payment.transactionId}
            </span>
          </div>
        )}

        {payment.capturedAt && (
          <div className="mt-3 flex items-center justify-between text-subtext">
            <span>Captured</span>
            <span>{formatDateShort(payment.capturedAt)}</span>
          </div>
        )}
      </div>
    </section>
  );
}