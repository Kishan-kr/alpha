//Orders.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchOrders } from "../store/actions/orderAction";
import OrderCard from "../components/orders/OrderCard";
import LoadingScreen from "../components/common/LoadingScreen";
import ErrorScreen from "../components/common/ErrorScreen";
import { goPrevOrdersPage, goNextOrdersPage } from "../store/slices/orderSlice"; // pagination
import { ORDERS_PAGE_LIMIT } from "../constants/appConstants";

export default function Orders() {
  const dispatch = useDispatch();
  const orders = useSelector((s) => s.orders.list);
  const loading = useSelector((s) => s.orders.listLoading);
  const listError = useSelector((s) => s.orders.listError);

  // pagination
  const { page, limit = ORDERS_PAGE_LIMIT, total, totalPages } = useSelector((s) => s.orders.pagination);

  useEffect(() => {
    dispatch(fetchOrders({ page, limit }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit]);

  const handleRefresh = () => {
    dispatch(fetchOrders({ page, limit }));
  };

  const handlePrev = () => {
    if (page > 1) dispatch(goPrevOrdersPage());
  };

  const handleNext = () => {
    if (page < totalPages) dispatch(goNextOrdersPage());
  };

  return (
    <div className="bg-light px-6 py-20 md:px-24 md:py-24">
      {/* Title */}
      <div className="flex items-baseline justify-between">
        <h2 className="text-2xl w-24 xs:w-full uppercase font-gfs-didot text-dark">My Orders</h2>
        <div className="flex flex-col xs:flex-row items-end xs:items-center gap-2">
          <button
            onClick={handleRefresh}
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


      {/* Content */}
      <div className="mt-10 space-y-10">
        {loading ? <LoadingScreen/> : listError ? 
        <ErrorScreen error={listError} /> : !orders?.length ? (
          <div className="border border-hover-tint bg-light px-6 py-12 text-center text-subtext">
            You haven’t placed any orders yet.
          </div>
        ) : (
          orders.map((order) => <OrderCard key={order._id} order={order} />)
        )}
      </div>

      {/* Pager */}
      {!loading && !listError && total > 0 && (
        <div className="mt-10 flex flex-col xs:flex-row items-center justify-between gap-3">
          <p className="text-xxs uppercase text-subtext">
            Showing {total > 0 ? (page - 1) * limit + 1 : 0}
            -
            {total > 0 ? Math.min((page - 1) * limit + (orders?.length || 0), total) : 0}
            {" "}of {total}
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={page <= 1}
              className={`uppercase text-xs px-3 py-1 border ${
                page > 1
                  ? "border-dark text-dark hover:bg-surface"
                  : "border-hover-tint text-hover-tint cursor-not-allowed"
              }`}
              aria-disabled={page <= 1}
              title="Previous page"
            >
              ‹ Prev
            </button>

            <span className="text-xs text-subtext uppercase px-2 py-1">
              Page {page} / {totalPages}
            </span>

            <button
              onClick={handleNext}
              disabled={page >= totalPages}
              className={`uppercase text-xs px-3 py-1 border ${
                page < totalPages
                  ? "border-dark text-dark hover:bg-surface"
                  : "border-hover-tint text-hover-tint cursor-not-allowed"
              }`}
              aria-disabled={page >= totalPages}
              title="Next page"
            >
              Next ›
            </button>
          </div>
        </div>
      )}
    </div>
  );
}