import React from "react";
import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";
import OrderItemRow from "./OrderItemRow";
import { formatDateShort } from "../../utils/dateFormatter";

export default function OrderCard({ order }) {
  const orderNumber = order?.orderNumber;
  const placed = formatDateShort(order?.placedAt || order?.createdAt);

  return (
    <section className="border border-hover-tint bg-light">
      {/* Header */}
      <div className="flex items-start justify-between px-6 py-5 md:px-8 md:py-6">
        <div className="space-y-2">
          <StatusBadge status={order?.status} />
          <p className="text-xs text-subtext">Placed on <span className="block xs:inline">{placed}</span></p>
        </div>
        <div className="text-xs text-right self-end">
          <span className="text-subtext">Order No:&nbsp;</span>
          <span className="block xs:inline text-dark font-medium">{orderNumber}</span>
        </div>
      </div>

      {/* Items */}
      <div className="px-6 md:px-8 pb-6 md:pb-8">
        <div className="bg-light">
          {(order?.items || []).map((item, idx) => (
            <div key={item._id} className={idx > 0 ? "border-t border-hover-tint" : ""}>
              <OrderItemRow item={item} />
            </div>
          ))}
        </div>

        {/* Footer actions */}
        <div className="mt-6 flex justify-end">
          <Link
            to={`/orders/${order?._id}`}
            className="uppercase text-xs px-5 py-2 bg-dark text-light hover:opacity-90"
          >
            View Details &nbsp;›
          </Link>
        </div>
      </div>
    </section>
  );
}