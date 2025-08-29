// src/components/bag/Checkout.jsx
import React, { useMemo, useState } from "react";
import CheckoutProductCard from "./CheckoutProductCard";
import { Lock } from "lucide-react";
import BackButton from "./BackButton";
import toast from "react-hot-toast";
import { showErrorToastWithIcon } from "../../utils/customToasts";

/**
 * Props:
 *  - products: [{ _id|id|productId, title, thumbnail, color, size, quantity, effectivePrice, originalPrice }]
 *  - subtotal, discount, delivery, total: number
 *  - deliveryAddress?: { fullName, phone, line1, line2, city, state, pincode, country }
 *  - handleBack: () => void
 *  - onPlaceOrder?: (payload) => Promise<void> | void         // called for COD
 *  - onStartPayment?: (payload) => Promise<void> | void       // called for Online
 */
export default function Checkout({
  products = [],
  subtotal = 0,
  discount = 0,
  delivery = 0,
  total = 0,
  deliveryAddress,
  handleBack,
  onPlaceOrder,
  onStartPayment,
}) {
  const [paymentMethod, setPaymentMethod] = useState("ONLINE"); // "COD" | "ONLINE"
  const [loading, setLoading] = useState(false);

  const cleanItems = useMemo(
    () =>
      (products || []).map((p) => ({
        productId: p.productId || p._id || p.id,
        title: p.title,
        quantity: Number(p.quantity || 1),
        price: Number(p.effectivePrice ?? p.originalPrice ?? 0),
        size: p.size,
        color: p.color,
        sku: p.sku,
        thumbnail: p.thumbnail,
      })),
    [products]
  );

  const payload = useMemo(
    () => ({
      items: cleanItems,
      address: deliveryAddress || null,
      payment: {
        method: paymentMethod, // "COD" | "ONLINE"
        amount: Number(total || 0),
      },
      totals: {
        subtotal: Number(subtotal || 0),
        discount: Number(discount || 0),
        delivery: Number(delivery || 0),
        grandTotal: Number(total || 0),
      },
    }),
    [cleanItems, deliveryAddress, paymentMethod, subtotal, discount, delivery, total]
  );

  const ensureAddress = () => {
    if (!payload.address) {
      showErrorToastWithIcon("Please select or add a delivery address.");
      return false;
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!ensureAddress()) return;
    try {
      setLoading(true);
      if (paymentMethod === "COD") {
        if (typeof onPlaceOrder === "function") {
          await onPlaceOrder(payload);
        } else {
          // fallback for now if not wired
          console.warn("onPlaceOrder callback not provided. Payload:", payload);
          toast.success("Order placed (COD) — integrate onPlaceOrder to persist.");
        }
      } else {
        if (typeof onStartPayment === "function") {
          await onStartPayment(payload); // expect this to open your gateway / redirect
        } else {
          console.warn("onStartPayment callback not provided. Payload:", payload);
          showErrorToastWithIcon("Online payment is not configured yet.");
        }
      }
    } catch (err) {
      showErrorToastWithIcon(
        (typeof err === "object" && err && err.message) || String(err) || "Failed to proceed"
      );
    } finally {
      setLoading(false);
    }
  };

  const addrLine1 = useMemo(() => {
    if (!deliveryAddress) return "—";
    const parts = [
      deliveryAddress.fullName,
      deliveryAddress.phone && `+91 ${deliveryAddress.phone}`,
    ]
      .filter(Boolean)
      .join(", ");
    return parts || "—";
  }, [deliveryAddress]);

  const addrLine2 = useMemo(() => {
    if (!deliveryAddress) return "";
    const parts = [
      deliveryAddress.line1,
      deliveryAddress.line2,
      deliveryAddress.city,
      deliveryAddress.state && `${deliveryAddress.state} - ${deliveryAddress.pincode || ""}`,
      deliveryAddress.country,
    ]
      .filter(Boolean)
      .join(", ");
    return parts;
  }, [deliveryAddress]);

  return (
    <div className="py-6 md:p-10 gap-8 text-dark grid grid-cols-1 lg:grid-cols-2">
      {/* Left: Order Summary */}
      <div>
        <div className="flex gap-x-2 items-center mb-4">
          <BackButton handleClick={handleBack} className="-mt-1" />
          <h2 className="text-xl uppercase font-gfs-didot text-dark">Order Summary</h2>
        </div>

        <div className="flex flex-col gap-4">
          {(products || []).map((product) => (
            <CheckoutProductCard key={product._id || product.id} product={product} />
          ))}
        </div>

        <div className="mt-4 p-4 bg-light border border-hover-tint">
          <div className="flex justify-between text-subtext mb-1">
            <span>Subtotal</span>
            <span>₹{Number(subtotal || 0).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-subtext mb-1">
            <span>Shipping</span>
            <span>{Number(delivery || 0) > 0 ? `₹${Number(delivery).toFixed(2)}` : "Free"}</span>
          </div>
          <div className="flex justify-between text-subtext mb-1">
            <span>Discount</span>
            <span>₹{Number(discount || 0).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-dark font-semibold text-lg mt-2">
            <span>Total</span>
            <span>₹{Number(total || 0).toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Right: Address + Payment */}
      <div className="bg-light sm:border border-hover-tint py-6 sm:p-6">
        {/* Delivery address summary */}
        <div className="mb-6">
          <h3 className="uppercase text-sm text-dark mb-2">Delivering To</h3>
          <div className="border border-hover-tint bg-surface p-3 text-sm">
            <p className="font-light text-dark">{addrLine1}</p>
            {addrLine2 && <p className="font-light text-dark">{addrLine2}</p>}
          </div>
        </div>

        {/* Payment selection */}
        <div>
          <h3 className="uppercase text-sm text-dark mb-3">Payment Method</h3>

          <label className={`block border p-3 cursor-pointer ${paymentMethod === "ONLINE" ? "bg-surface border-dark" : "bg-light border-hover-tint"}`}>
            <input
              type="radio"
              name="payment-method"
              className="sr-only"
              checked={paymentMethod === "ONLINE"}
              onChange={() => setPaymentMethod("ONLINE")}
            />
            <div className="flex items-center justify-between">
              <span className="text-sm">Online Payment (UPI / Card / NetBanking)</span>
              {paymentMethod === "ONLINE" && <span className="text-xxs uppercase">Selected</span>}
            </div>
            <p className="mt-1 text-xxs uppercase text-subtext">Secure payment via gateway</p>
          </label>

          <label className={`block border p-3 cursor-pointer mb-2 ${paymentMethod === "COD" ? "bg-surface border-dark" : "bg-light border-hover-tint"}`}>
            <input
              type="radio"
              name="payment-method"
              className="sr-only"
              checked={paymentMethod === "COD"}
              onChange={() => setPaymentMethod("COD")}
            />
            <div className="flex items-center justify-between">
              <span className="text-sm">Cash on Delivery (COD)</span>
              {paymentMethod === "COD" && <span className="text-xxs uppercase">Selected</span>}
            </div>
            <p className="mt-1 text-xxs uppercase text-subtext">Pay in cash when the order arrives</p>
          </label>
        </div>

        {/* Action button */}
        <button
          onClick={handlePlaceOrder}
          disabled={loading}
          className="mt-6 w-full rounded-none bg-dark text-light text-xs uppercase px-6 py-3 enabled:cursor-pointer hover:opacity-90 flex items-center justify-center gap-2"
        >
          {loading ? (
            "Processing…"
          ) : paymentMethod === "COD" ? (
            <>
              <Lock size={16} /> Place Order (COD) — ₹{Number(total || 0).toFixed(2)}
            </>
          ) : (
            <>
              <Lock size={16} /> Continue to Payment — ₹{Number(total || 0).toFixed(2)}
            </>
          )}
        </button>

        {/* tiny reassurance */}
        <p className="mt-3 text-xxs uppercase text-subtext">
          Your details are secured & never shared.
        </p>
      </div>
    </div>
  );
}