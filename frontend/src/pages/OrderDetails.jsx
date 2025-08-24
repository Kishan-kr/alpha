import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import {
  fetchOrderById,
  cancelOrder,
  requestItemReturn,
  requestItemExchange,
  getStocksOfAnItems,
} from "../store/actions/orderAction";

// components
import StatusBadge from "../components/orders/StatusBadge";
import OrderItem from "../components/orders/OrderItem";
import OrderSummary from "../components/orders/OrderSummary";
import PaymentInfo from "../components/orders/PaymentInfo";
import ShippingInfo from "../components/orders/ShippingInfo";
import { formatDateShort, withinHours, withinNDays } from "../utils/dateFormatter";
import LoadingScreen from "../components/common/LoadingScreen";
import BackButton from "../components/bag/BackButton";

// modals
import ReturnModal from "../components/orders/ReturnModal";
import ExchangeModal from "../components/orders/ExchangeModal";
import { showErrorToastWithIcon } from "../utils/customToasts";
import CancelOrderModal from "../components/orders/CancelModal";

export default function OrderDetails() {
  const { orderId } = useParams();
  const dispatch = useDispatch();

  const order = useSelector((s) => s.orders.current);
  const loading = useSelector((s) => s.orders.currentLoading);
  const actionLoading = useSelector((s) => s.orders.actionLoading);
  const currentError = useSelector((s) => s.orders.currentError);
  const actionError = useSelector((s) => s.orders.actionError);

  const [showReturnModal, setShowReturnModal] = useState(null); // itemId
  const [showExchangeModal, setShowExchangeModal] = useState(null); // item object
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [exchangeSizes, setExchangeSizes] = useState([]);

  useEffect(() => {
    dispatch(fetchOrderById(orderId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  useEffect(() => {
    if (currentError) {
      showErrorToastWithIcon(currentError);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentError]);

  // business rules
  const shippedOrLater = useMemo(
    () => (order ? ["SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED"].includes(order.status) : false),
    [order]
  );

  // Cancel: within 24h of placedAt, not shipped/out-for-delivery/delivered, not already cancelled
  const canCancel = useMemo(() => {
    if (!order?.placedAt) return false;
    if (order.status === "CANCELLED") return false;
    if (shippedOrLater) return false;
    return withinHours(order.placedAt, 24);
  }, [order, shippedOrLater]);

  // Item-level eligibility (NEW orders only, delivered, within 3 days, and not already in RMA flow)
  const DISALLOWED_ITEM_STATUSES = useMemo(
    () =>
      new Set([
        "RETURN_REQUESTED",
        "RETURN_REJECTED",
        "RETURNED",
        "EXCHANGE_REQUESTED",
        "EXCHANGE_REJECTED",
        "EXCHANGE_DELIVERED",
      ]),
    []
  );

  const canReturnItem = useCallback(
    (it) => {
      if (!order) return false;
      if (order.type !== "NEW") return false;
      if (order.status !== "DELIVERED") return false;

      // use item.deliveredAt if present; fallback to order.deliveredAt
      const deliveredAt = it?.deliveredAt || order?.deliveredAt;
      if (!deliveredAt) return false;

      if (DISALLOWED_ITEM_STATUSES.has(it?.status)) return false;

      return withinNDays(deliveredAt, 3);
    },
    [order, DISALLOWED_ITEM_STATUSES]
  );

  // Exchange uses same window/conditions as return
  const canExchangeItem = canReturnItem;


  // Totals (defensive)
  const itemsTotal = Number(order?.totals?.itemsTotal ?? 0);
  const shippingFee = Number(order?.totals?.shippingFee ?? 0);
  const discount = Number(order?.totals?.discount ?? 0);
  const grandTotal =
    order?.totals?.grandTotal != null
      ? Number(order.totals.grandTotal)
      : itemsTotal + shippingFee - discount;

  // Derived UI meta
  const orderNumber = order?.orderNumber || "";
  const placed = order?.placedAt ? formatDateShort(order.placedAt) : null;

  // Handlers
  const handleExchangeClick = async (item) => {
    try {
      const res = await dispatch(getStocksOfAnItems(item.productId)).unwrap();
      const sizes = (res?.sizes || [])
        .filter((s) => s.quantity > 0 && s.size !== item.size)
        .map((s) => s.size);
      setExchangeSizes(sizes);
      setShowExchangeModal(item); // open modal
    } catch (err) {
      console.error("Failed to fetch stocks:", err);
    }
  };

  const onCancel = useCallback(async () => {
    const result = await dispatch(cancelOrder(order._id));
    if (result.meta.requestStatus === "fulfilled") {
      toast.success("Order cancelled.");
      dispatch(fetchOrderById(orderId));
    } else {
      const errPayload = result.payload || "Failed to cancel the order";
      if (errPayload && typeof errPayload === "object" && !Array.isArray(errPayload)) {
        Object.values(errPayload).forEach((msg) => showErrorToastWithIcon(msg));
      } else {
        showErrorToastWithIcon(errPayload);
      }
    }
  }, [dispatch, order?._id, orderId]);

  const handleReturnConfirm = useCallback(
    async (reason) => {
      const result = await dispatch(
        requestItemReturn({ orderId: order._id, itemId: showReturnModal, reason })
      );
      if (result.meta.requestStatus === "fulfilled") {
        toast.success("Item return requested.");
        setShowReturnModal(null);
        dispatch(fetchOrderById(orderId));
      } else {
        const errPayload = result.payload || "Failed to request return";
        if (errPayload && typeof errPayload === "object" && !Array.isArray(errPayload)) {
          Object.values(errPayload).forEach((msg) => showErrorToastWithIcon(msg));
        } else {
          showErrorToastWithIcon(errPayload);
        }
      }
    },
    [dispatch, order?._id, showReturnModal, orderId]
  );

  const handleExchangeConfirm = useCallback(
    async (payload) => {
      const result = await dispatch(
        requestItemExchange({
          orderId: order._id,
          itemId: showExchangeModal._id,
          payload,
        })
      );
      if (result.meta.requestStatus === "fulfilled") {
        toast.success("Exchange requested.");
        setShowExchangeModal(null);
        dispatch(fetchOrderById(orderId));
      } else {
        const errPayload = result.payload || "Failed to request exchange";
        if (errPayload && typeof errPayload === "object" && !Array.isArray(errPayload)) {
          Object.values(errPayload).forEach((msg) => showErrorToastWithIcon(msg));
        } else {
          showErrorToastWithIcon(errPayload);
        }
      }
    },
    [dispatch, order?._id, showExchangeModal, orderId]
  );

  const handleBack = useCallback(() => {
    // keep your existing back logic
    history.back();
  }, []);


  if (loading) {
    return <LoadingScreen />;
  }

  if (!order) {
    return (
      <div className="bg-light px-6 py-20 md:px-24 md:py-24 mt-8">
        <p className="border border-hover-tint uppercase bg-light px-6 py-12 text-sm text-center text-subtext">
          Order not found
        </p>
      </div>
    );
  }

  return (
    <div className="bg-light px-6 py-20 md:px-24 md:py-24">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <div className="flex gap-x-2 items-center mb-8">
            <BackButton handleClick={handleBack} className="-mt-px" />
            <h2 className="text-2xl uppercase font-gfs-didot text-dark">
              Order Details
            </h2>
          </div>

          <StatusBadge status={order?.status} />
          <p className="text-xs text-subtext">Placed on {placed}</p>

          {/* Delivered date */}
          {order?.status === "DELIVERED" && order?.deliveredAt && (
            <p className="text-xs text-subtext">
              Delivered on {formatDateShort(order?.deliveredAt)}
            </p>
          )}

          {/* Original order link */}
          {(order.type === "RETURN" || order.type === "EXCHANGE") &&
            order.originalOrderId && (
              <div className="mt-2 py-2 text-xs text-dark">
                This is {order.type === "RETURN" ? "a" : "an"} {order.type.toLowerCase()} order.{" "}
                <Link
                  to={`/orders/${order.originalOrderId}`}
                  className="underline hover:text-dark"
                >
                  View Original Order
                </Link>
              </div>
            )}
        </div>
        <div className="text-xs">
          <span className="text-subtext">Order No:&nbsp;</span>
          <span className="text-dark font-medium">{orderNumber}</span>
        </div>
      </div>

      {/* Primary actions */}
      <div className="mt-8 flex flex-wrap gap-3">
        <button
          onClick={() => setShowCancelModal(true)}
          disabled={!canCancel || actionLoading}
          className={`uppercase text-xs px-5 py-2 border enabled:cursor-pointer ${canCancel && !actionLoading
            ? "border-dark text-dark hover:bg-surface"
            : "border-hover-tint text-hover-tint"
            }`}
        >
          {actionLoading ? "Processing…" : "Cancel Order"}
        </button>
      </div>

      {/* Return/Exchange closed message */}
      {order?.type === "NEW" &&
        order?.status === "DELIVERED" &&
        !withinNDays(order?.deliveredAt, 3) && 
        (
          <div className="mt-6 border border-hover-tint bg-surface px-4 py-3 text-xs text-subtext">
            The return or exchange window has been closed for this order.
          </div>
        )}

      {/* Main content */}
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <section className="lg:col-span-2 border border-hover-tint bg-light">
          <div className="px-5 py-4 md:px-8 border-b border-hover-tint text-sm uppercase text-dark">
            Items
          </div>

          <ul className="px-5 md:px-8">
            {order.items?.map((item, idx) => (
              <li
                key={item._id}
                className={idx > 0 ? "border-t border-hover-tint" : ""}
              >
                <OrderItem
                  item={item}
                  actionLoading={actionLoading}
                  canReturn={canReturnItem(item)}
                  canExchange={canExchangeItem(item)}
                  onReturn={() => setShowReturnModal(item._id)}
                  onExchange={() => handleExchangeClick(item)}
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

      {/* ===== Modals ===== */}
      {showReturnModal && (
        <ReturnModal
          loading={actionLoading}
          onClose={() => setShowReturnModal(null)}
          onConfirm={handleReturnConfirm}
        />
      )}

      {showExchangeModal && (
        <ExchangeModal
          availableSizes={exchangeSizes}
          loading={actionLoading}
          onClose={() => setShowExchangeModal(null)}
          onConfirm={handleExchangeConfirm}
        />
      )}

      {showCancelModal && (
        <CancelOrderModal
          loading={actionLoading}
          onClose={() => setShowCancelModal(false)}
          onConfirm={async () => {
            await onCancel();
            setShowCancelModal(false);
          }}
        />
      )}

    </div>
  );
}
