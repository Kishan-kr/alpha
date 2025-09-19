import React, { useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";

export default function OrderSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");
  const orderNumber = searchParams.get("ordn");

  useEffect(() => {

    if (!token || !orderNumber || token.length < 128) {
      navigate("/orders");
    }
  }, [token, navigate]);

  if (!orderNumber || !token) {
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
        {orderNumber ? (
          <>
            {" "}
            Your order <span className="font-medium text-dark">#{orderNumber}</span>{" "}
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