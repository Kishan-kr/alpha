import React, { useState } from "react";
import { useSelector } from "react-redux"
import api from "../../api/axiosClient";
import { Lock } from "lucide-react";
import { showErrorToastWithIcon } from "../../utils/customToasts";

export default function RazorpayPaymentButton({ orderPayload, onOrderSuccess = () => {}, setVerificationInProgress = () => {} }) {
  const [loading, setLoading] = useState(false);
  const { userInfo: user } = useSelector(state => state.user);

  const fullname = [user?.firstName, user?.lastName].filter(Boolean).join(" ");

  // Dynamically load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        return resolve(true);
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleCheckout = async () => {
    setLoading(true);

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      alert("Failed to load Razorpay SDK. Please try again.");
      setLoading(false);
      return;
    }

    try {
      // 1. Create order in backend (DB + Razorpay)
      const response = await api.post("/payments/create-order", orderPayload);
      const { data, status } = response;

      if (!data.status) {
        // Handle backend error codes
        if (status === 503) {
          showErrorToastWithIcon("Failed to process order. Please try again.");
        } else if (status === 409 && Array.isArray(data.errors)) {
          // Stock error: show all errors
          data.errors.forEach((errMsg) => showErrorToastWithIcon(errMsg));
        } else if (data.error) {
          showErrorToastWithIcon(data.error);
        } else {
          showErrorToastWithIcon("Failed to process order. Try again.");
        }
        setLoading(false);
        return;
      }

      const { order } = data; // Razorpay order object

      // 2. Initialize Razorpay checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // from .env
        amount: order.amount,
        currency: order.currency,
        name: "Tashn",
        description: "Order Payment",
        order_id: order.id, // Razorpay order_id
        handler: async function (response) {
          setVerificationInProgress(true);
          // 3. Verify payment in backend
          const verifyRes = await api.post("/payments/verify-payment", {
              order_id: order.id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
          });

          const verifyData = verifyRes.data;
          if (verifyData.status) {
            // Redirect to success page with order number and secure token
            onOrderSuccess(verifyData?.orderNumber, verifyData.token);
          } else {
            showErrorToastWithIcon(verifyData.error || "Payment verification failed");
          }
          setVerificationInProgress(false);
        },
        prefill: {
          name: fullname || "Customer",
          email: user?.email || "customer@example.com",
          contact: user?.phone || "9999999999",
        },
        theme: {
          color: "#000000", // brand color
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      // Handle network or unexpected errors
      if (err?.response?.status === 503) {
        showErrorToastWithIcon("Failed to process order. Please try again.");
      } else if (err?.response?.status === 409 && Array.isArray(err?.response?.data?.errors)) {
        err.response.data.errors.forEach((errMsg) => showErrorToastWithIcon(errMsg));
      } else if (err?.response?.data?.error) {
        showErrorToastWithIcon(err.response.data.error);
      } else {
        showErrorToastWithIcon("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className={`mt-6 w-full rounded-none bg-dark text-light text-xs uppercase px-6 py-3 enabled:cursor-pointer hover:opacity-90 flex items-center justify-center gap-2`}
    >
      {loading ? (
            "Processing…"
          ) : (
            <>
              <Lock size={16} /> Continue to Payment — ₹{Number(orderPayload?.totals?.grandTotal || 0).toFixed(2)}
            </>
          )}
    </button>
  );
}