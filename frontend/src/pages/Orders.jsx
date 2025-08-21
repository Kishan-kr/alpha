import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchOrders } from "../store/actions/orderAction";

// components
import OrderCard from "../components/orders/OrderCard";

export default function Orders() {
  const dispatch = useDispatch();
  const orders = useSelector((s) => s.orders.list);
  const loading = useSelector((s) => s.orders.listLoading);
  const listError = useSelector((s) => s.orders.listError);

  useEffect(() => {
    if (!orders?.length) dispatch(fetchOrders());
  }, []);

  return (
    <div className="bg-light px-6 py-20 md:px-24 md:py-24">
      {/* Title */}
      <div className="flex items-baseline justify-between">
        <h2 className="text-2xl w-24 xs:w-full uppercase font-gfs-didot text-dark">My Orders</h2>
        <div className="flex flex-col xs:flex-row items-end xs:items-center gap-2">
          <button
            onClick={() => dispatch(fetchOrders())}
            className="uppercase text-xs px-3 py-1 border border-hover-tint text-dark hover:bg-surface"
          >
            Refresh
          </button>
          <Link
            to="/"
            className="uppercase text-xs underline xs:no-underline xs:px-3 py-1 xs:border xs:text-nowrap border-hover-tint text-dark hover:bg-surface"
          >
            Continue Shopping
          </Link>
        </div>
      </div>

      {/* Alerts */}
      {listError && (
        <div className="mt-6 border border-hover-tint bg-surface px-4 py-3 text-xs text-subtext">
          {listError}
        </div>
      )}

      {/* Content */}
      <div className="mt-10 space-y-10">
        {loading ? (
          <div className="text-sm text-subtext">Loading…</div>
        ) : !orders?.length ? (
          <div className="border border-hover-tint bg-light px-6 py-12 text-center text-subtext">
            You haven’t placed any orders yet.
          </div>
        ) : (
          orders.map((order) => <OrderCard key={order._id} order={order} />)
        )}
      </div>
    </div>
  );
}