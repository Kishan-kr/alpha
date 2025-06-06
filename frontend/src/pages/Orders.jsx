import React, { useEffect, useState } from 'react';
import OrderGroup from '../components/orders/OrderGroup';
import orders from '../utils/orders'

export default function OrdersPage() {
  // const [orders, setOrders] = useState([]);

  // useEffect(() => {
  //   // Simulate fetching orders
  //   fetch('/api/mock-orders') // replace with real API route
  //     .then(res => res.json())
  //     .then(data => setOrders(data));
  // }, []);

  return (
    <div className="max-w-3xl mx-auto py-20 md:px-8 md:py-24 px-4 text-light">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map(order => <OrderGroup key={order._id} order={order} />)
      )}
    </div>
  );
}