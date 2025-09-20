import React, { useMemo, useState } from "react";
import CheckoutProductCard from "./CheckoutProductCard";
import { Lock } from "lucide-react";
import BackButton from "./BackButton";
import toast from "react-hot-toast";
import { showErrorToastWithIcon } from "../../utils/customToasts";
import RazorpayPaymentButton from "./RazorpayPaymentButton";
import api from "../../api/axiosClient";

/**
 * Props:
 *  - products: [{ _id|id|productId, title, thumbnail, color, size, quantity, effectivePrice, originalPrice }]
 *  - subtotal, discount, delivery, total: number
 *  - deliveryAddress?: { fullName, phone, line1, line2, city, state, pincode, country }
 *  - handleBack: () => void
 *  - onPlaceOrder?: (payload) => Promise<void> | void         // called for COD
 */
export default function Checkout({
  products = [],
  subtotal = 0,
  discount = 0,
  delivery = 0,
  total = 0,
  deliveryAddress,
  handleBack,
  onOrderSuccess = () => {}
}) {
  const [paymentMethod, setPaymentMethod] = useState("ONLINE"); // "COD" | "ONLINE"
  const [loading, setLoading] = useState(false);
  const [verificationInProgress, setVerificationInProgress] = useState(false);
  // const [errors, setErrors] = useState([]);

  const cleanItems = useMemo(
    () =>
      (products || []).map((p) => ({
        productId: p.productId || p._id || p.id,
        title: p.title,
        quantity: Number(p.quantity || 1),
        price: Number(p.effectivePrice ?? p.originalPrice ?? 0),
        subtotal: Number(p.effectivePrice ?? p.originalPrice ?? 0),
        size: p.size,
        color: p.color,
        sku: p.sku,
        thumbnail: p.thumbnail,
        variantId: p.variantId
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

  // handle COD order placement only
  const handlePlaceOrder = async () => {
    if (!ensureAddress()) return;
    setLoading(true);
    try {
      // 1. Create order in backend (DB + Razorpay)
      const response = await api.post("/orders", payload);
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
        return;
      }

      const { order, token } = data;
      onOrderSuccess(order?.orderNumber, token);
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

  if( verificationInProgress ) {
    return (
      <div className="py-6 md:p-10 gap-8 text-dark grid grid-cols-1 lg:grid-cols-2">
        <div className="col-span-2 flex flex-col items-center justify-center min-h-[300px]">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-8 w-8 mb-4"></div>
          <p className='text-xs tracking-wider font-light uppercase animate-pulse'>Verifying Payment...</p>
          <p className="text-subtext text-xs font-light mt-2 text-center">Please do not refresh or close the page.</p>
        </div>
      </div>
    )
  }

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
            <p className="mt-1 text-xxs uppercase text-subtext">Secure payment via Razorpay</p>
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
        {paymentMethod === "COD" ?
          <button
            onClick={handlePlaceOrder}
            disabled={loading}
            className="mt-6 w-full rounded-none bg-dark text-light text-xs uppercase px-6 py-3 enabled:cursor-pointer hover:opacity-90 flex items-center justify-center gap-2"
          >
            {loading ? (
              "Processing…"
            ) : (
              <>
                <Lock size={16} /> Place Order (COD) — ₹{Number(total || 0).toFixed(2)}
              </>
            )}
          </button> :
          <RazorpayPaymentButton 
            orderPayload={payload} 
            onOrderSuccess={onOrderSuccess}
            setVerificationInProgress={setVerificationInProgress}
          />
        }


        {/* tiny reassurance */}
        <p className="mt-3 text-xxs uppercase text-subtext">
          Your details are secured & never shared.
        </p>
      </div>
    </div>
  );
}