import React, { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import LoadingScreen from "../components/common/LoadingScreen";
import api from "../api/axiosClient";

export default function OrderSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState({exists: false, id: null });

  const token = searchParams.get("token");

  useEffect(() => {
    const verify = async () => {
      try {
        const { data } = await api.get(`/fastrr/orders/verify?token=${token}`);
        if (data.valid) {
          setOrder({exists: true, id: data.orderId});
        } else {
          navigate("/orders"); // invalid token → redirect
        }
      } catch (err) {
        console.warn('in catch block')
        navigate("/orders");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      verify();
    } else {
      navigate("/orders");
    }
  }, [token, navigate]);

  if (loading) {
    return (
      <LoadingScreen />
    );
  }

  if (!order.exists) {
    return null
  }

  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-light px-6 py-16 text-center">
      {/* Success Icon */}
      <CheckCircle className="text-[var(--olive-green)] w-12 h-12 mb-4" />

      {/* Title */}
      <h1 className="text-xl md:text-2xl font-semibold tracking-widest text-dark mb-2 uppercase">
        Order Placed
      </h1>

      {/* Subtitle */}
      <p className="text-sm text-subtext mb-6 max-w-md">
        Thank you for shopping with us.
        {order.exists ? (
          <>
            {" "}
            Your order <span className="font-medium text-dark">#{order.id}</span>{" "}
            has been received.
          </>
        ) : (
          " We’ve received your order."
        )}{" "}
        A confirmation has been sent to your email or phone.
      </p>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          to="/orders"
          className="px-5 py-2 border border-dark text-xs uppercase tracking-wider text-dark hover:bg-dark hover:text-light transition"
        >
          View My Orders
        </Link>

        <Link
          to="/"
          className="px-5 py-2 bg-[var(--olive-green)] text-xs uppercase tracking-wider text-dark hover:bg-dark hover:text-light transition"
        >
          Continue Shopping
        </Link>
      </div>
    </section>
  );
}