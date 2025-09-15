import React, { useState } from "react";
import api from "../../api/axiosClient";
import { showErrorToastWithIcon } from "../../utils/customToasts";

export default function CheckoutButton({ items }) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await api.post(`/fastrr/checkout/initiate`, { items });
      console.log('token response data: ', data); // debug
      const token = data?.result?.token;
      if (!token) throw new Error("No token received");

      // Global script already loaded
      window.HeadlessCheckout.addToCart(e, token);
    } catch (err) {
      console.error("Checkout init failed:", err);
      showErrorToastWithIcon("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className="text-sm mt-9 uppercase w-full justify-center items-center px-6 py-2 bg-dark text-light cursor-pointer"
    >
      {loading ? "Processing..." : "Checkout"}
    </button>
  );
}