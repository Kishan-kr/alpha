import React from "react";
import OrderCard from "../components/orders/OrderCard"; // Make sure this path matches
import { orders } from "../utils/orders"; // Dummy orders array

const Orders = () => {
  return (
    <div className="bg-dark min-h-screen p-4 md:p-8">
      <h2 className="text-light text-2xl font-semibold mb-6">My Orders</h2>
      <div className="space-y-4">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
};

export default Orders;