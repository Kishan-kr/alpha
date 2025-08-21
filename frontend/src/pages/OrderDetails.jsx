import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";

import {
  fetchOrderById,
  cancelOrder,
  requestWholeReturn,
  requestItemReturn,
  requestItemExchange,
} from "../store/actions/orderAction";

// components
import StatusBadge from "../components/orders/StatusBadge";
import OrderItem from "../components/orders/OrderItem";
import OrderSummary from "../components/orders/OrderSummary";
import PaymentInfo from "../components/orders/PaymentInfo";
import ShippingInfo from "../components/orders/ShippingInfo";
import { formatDateShort, withinNDays } from "../utils/dateFormatter";
import { LoaderCircle } from "lucide-react";


export default function OrderDetails() {
  const { orderId } = useParams();
  const dispatch = useDispatch();

  const order = useSelector((s) => s.orders.current);
  const loading = useSelector((s) => s.orders.currentLoading);
  const actionLoading = useSelector((s) => s.orders.actionLoading);
  const currentError = useSelector((s) => s.orders.currentError);
  const actionError = useSelector((s) => s.orders.actionError);

  const [toast, setToast] = useState("");

  useEffect(() => {
    dispatch(fetchOrderById(orderId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  // ===== business rules =====
  const inProcess = useMemo(
    () => (order ? ["CONFIRMED", "PROCESSING", "PACKED"].includes(order.status) : false),
    [order]
  );
  const anyShippedOrDelivered = useMemo(
    () => !!order?.items?.some((i) => ["SHIPPED", "DELIVERED"].includes(i.status)),
    [order]
  );
  const canCancel = inProcess && !anyShippedOrDelivered && order?.status !== "CANCELLED";

  const allDelivered = order?.items?.every((i) => i.status === "DELIVERED");
  const wholeReturnEligible =
    allDelivered && order?.items?.every((i) => withinNDays(i.deliveredAt, 3));

  // totals
  const itemsTotal = Number(order?.totals?.itemsTotal ?? 0);
  const shippingFee = Number(order?.totals?.shippingFee ?? 0);
  const discount = Number(order?.totals?.discount ?? 0);
  const grandTotal =
    order?.totals?.grandTotal != null
      ? Number(order.totals.grandTotal)
      : itemsTotal + shippingFee - discount;

  // ===== actions =====
  const onCancel = async () => {
    try {
      await dispatch(cancelOrder(order._id)).unwrap();
      setToast("Order cancelled.");
      dispatch(fetchOrderById(orderId));
    } catch { }
  };

  const onWholeReturn = async () => {
    const reason = window.prompt("Reason for return:");
    if (!reason) return;
    try {
      await dispatch(requestWholeReturn({ orderId: order._id, reason })).unwrap();
      setToast("Return requested for whole order.");
      dispatch(fetchOrderById(orderId));
    } catch { }
  };

  const onItemReturn = async (itemId) => {
    const reason = window.prompt("Reason for return:");
    if (!reason) return;
    try {
      await dispatch(requestItemReturn({ orderId: order._id, itemId, reason })).unwrap();
      setToast("Item return requested.");
      dispatch(fetchOrderById(orderId));
    } catch { }
  };

  const onItemExchange = async (item) => {
    const reason = window.prompt("Reason for exchange:");
    if (!reason) return;
    const newSize = window.prompt("Exchange size (e.g., S/M/L/XL):", item.size || "");
    const newColor = window.prompt("Exchange color:", item.color || "");
    const newSku = window.prompt("Exchange SKU (optional):", "");
    try {
      await dispatch(
        requestItemExchange({
          orderId: order._id,
          itemId: item._id,
          payload: { reason, newSize, newColor, newSku },
        })
      ).unwrap();
      setToast("Exchange requested.");
      dispatch(fetchOrderById(orderId));
    } catch { }
  };

  // ===== loading / empty =====
  if (loading) {
    return (
      <div className="flex justify-center py-24 mt-8">
        <p className='text-xs tracking-wider font-light uppercase animate-spin'><LoaderCircle /></p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bg-light px-6 py-20 md:px-24 md:py-24">
        <div className="border border-hover-tint bg-light px-6 py-12 text-center text-subtext">
          Order not found.
        </div>
      </div>
    );
  }

  // ===== render =====
  const idShort = `ORD${String(order._id).slice(-10).toUpperCase()}`;
  const placed = formatDateShort(order.placedAt || order.createdAt);

  return (
    <div className="bg-light px-6 py-20 md:px-24 md:py-24">
      {/* Header (stack on small) */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <h2 className="text-2xl uppercase font-gfs-didot text-dark">Order Details</h2>
          <StatusBadge status={order.status} />
          <p className="text-xs text-subtext">Placed on {placed}</p>
        </div>
        <div className="text-xs">
          <span className="text-subtext">Order No:&nbsp;</span>
          <span className="text-dark font-medium">{idShort}</span>
        </div>
      </div>

      {/* Alerts */}
      {(toast || currentError || actionError) && (
        <div className="mt-6 space-y-2">
          {toast && (
            <div className="border border-hover-tint bg-surface px-4 py-3 text-xs text-dark">
              {toast}
            </div>
          )}
          {currentError && (
            <div className="border border-hover-tint bg-surface px-4 py-3 text-xs text-subtext">
              {currentError}
            </div>
          )}
          {actionError && (
            <div className="border border-hover-tint bg-surface px-4 py-3 text-xs text-subtext">
              {actionError}
            </div>
          )}
        </div>
      )}

      {/* Primary actions (wrap on small) */}
      <div className="mt-8 flex flex-wrap gap-3">
        <button
          onClick={onCancel}
          disabled={!canCancel || actionLoading}
          className={`uppercase text-xs px-5 py-2 border enabled:cursor-pointer ${canCancel && !actionLoading
              ? "border-dark text-dark hover:bg-surface"
              : "border-hover-tint text-hover-tint"
            }`}
        >
          {actionLoading ? "Processing…" : "Cancel Order"}
        </button>

        <button
          onClick={onWholeReturn}
          disabled={!wholeReturnEligible || actionLoading}
          className={`uppercase text-xs px-5 py-2 border enabled:cursor-pointer ${wholeReturnEligible && !actionLoading
              ? "border-dark text-dark hover:bg-surface"
              : "border-hover-tint text-hover-tint"
            }`}
        >
          {actionLoading ? "Processing…" : "Return Whole Order"}
        </button>
      </div>

      {/* Main content */}
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items (2/3 width on desktop) */}
        <section className="lg:col-span-2 border border-hover-tint bg-light">
          <div className="px-5 py-4 md:px-8 border-b border-hover-tint text-sm uppercase text-dark">
            Items
          </div>

          <ul className="px-5 md:px-8">
            {order.items?.map((item, idx) => (
              <li key={item._id} className={idx > 0 ? "border-t border-hover-tint" : ""}>
                <OrderItem
                  item={item}
                  actionLoading={actionLoading}
                  onReturn={onItemReturn}
                  onExchange={onItemExchange}
                />
              </li>
            ))}
          </ul>
        </section>

        {/* Right column */}
        <div className="space-y-8">
          <OrderSummary
            totals={{
              itemsTotal,
              shippingFee,
              discount,
              grandTotal,
            }}
          />
          <PaymentInfo payment={order?.payment} />
          <ShippingInfo address={order?.address} shipment={order?.shipment} />
        </div>
      </div>

      {/* Back link */}
      <div className="mt-12">
        <Link to="/orders" className="uppercase text-xs underline text-dark">
          ← Back to Orders
        </Link>
      </div>
    </div>
  );
}