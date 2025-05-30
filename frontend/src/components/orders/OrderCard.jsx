import React from "react";

const OrderCard = ({ order }) => {
  return (
    <div className="bg-surface p-4 rounded-lg border border-border text-light flex flex-col md:flex-row justify-between gap-4 shadow-sm">
      <div className="flex items-start gap-4">
        <img
          src={order.product.image}
          alt={order.product.name}
          className="w-20 h-24 rounded object-cover"
        />
        <div>
          <h3 className="text-lg font-semibold">{order.product.name}</h3>
          <p className="text-sm text-subtext mt-1">
            Qty: {order.quantity} | Size: {order.product.size} | Color: {order.product.color}
          </p>
          <p className="text-sm text-subtext mt-1">
            Order ID: <span className="text-light">{order.id}</span>
          </p>
          <p className="text-sm mt-2 font-semibold text-primary">
            ₹{order.total}
          </p>
        </div>
      </div>
      <div className="text-right md:text-center flex md:flex-col justify-between md:justify-start gap-1 md:gap-2 min-w-[120px]">
        <span
          className={`px-3 py-1 text-xs rounded-full font-medium ${
            order.status === "Delivered"
              ? "bg-green-900 text-green-400"
              : order.status === "Shipped"
              ? "bg-yellow-900 text-yellow-400"
              : "bg-red-900 text-red-400"
          }`}
        >
          {order.status}
        </span>
        <p className="text-xs text-subtext">
          {new Date(order.date).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default OrderCard;