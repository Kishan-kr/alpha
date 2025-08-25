// src/pages/Shipping.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function ShippingAndDelivery() {
  return (
    <div className="bg-light px-6 py-20 md:px-24 md:py-24">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-xl uppercase font-gfs-didot text-dark">
          Shipping &amp; Delivery
        </h1>

        <div className="mt-6 space-y-5 text-sm text-dark">
          <p className="uppercase text-xxs tracking-wide text-subtext">
            Simple timelines, clear tracking
          </p>

          {/* Processing */}
          <ul className="list-[square] pl-5 space-y-3">
            <li>
              <span className="font-medium">Order Processing:</span>{" "}
              <span className="font-light">
                Orders are typically processed within <strong>24–48 hours</strong> (Mon–Sat, IST). During peak periods or special launches, processing may take slightly longer.
              </span>
            </li>

            {/* Methods & Timelines */}
            <li>
              <span className="font-medium">Delivery Timelines (India):</span>{" "}
              <span className="font-light">
                Metros: <strong>2–4 business days</strong> • Other locations:{" "}
                <strong>3–7 business days</strong>. You’ll receive tracking details by email/WhatsApp once dispatched.
              </span>
            </li>

            {/* Charges */}
            <li>
              <span className="font-medium">Shipping Charges:</span>{" "}
              <span className="font-light">
                Calculated at checkout based on destination and cart value. Free-shipping thresholds (if applicable) will be shown during checkout.
              </span>
            </li>

            {/* Tracking */}
            <li>
              <span className="font-medium">Tracking:</span>{" "}
              <span className="font-light">
                Track your shipment in <em>My Orders → Order Details</em>. Live status and courier checkpoints appear there after dispatch. If you don’t see updates, reach us at{" "}
                <a className="underline" href="mailto:care@tashn.in">care@tashn.in</a> or{" "}
                <a className="underline" href="tel:+919999955555">+91 89293 58439</a>.
              </span>
            </li>

            {/* Attempts */}
            <li>
              <span className="font-medium">Delivery Attempts:</span>{" "}
              <span className="font-light">
                Couriers usually make <strong>2–3 attempts</strong>. If unreachable, the parcel may be returned to us. For COD orders, please keep your phone available to confirm the delivery.
              </span>
            </li>

            {/* Address changes */}
            <li>
              <span className="font-medium">Address Changes:</span>{" "}
              <span className="font-light">
                We currently don’t support address edits after placing an order. Please review your address carefully at checkout. If there’s an error, you can cancel within <strong>24 hours</strong> (before dispatch) and place a new order.
              </span>
            </li>

            {/* Delays */}
            <li>
              <span className="font-medium">Delays &amp; Exceptions:</span>{" "}
              <span className="font-light">
                Weather, remote locations, or carrier constraints can cause delays. We’ll keep you posted if we spot an exception on your tracking.
              </span>
            </li>

            {/* International */}
            <li>
              <span className="font-medium">International Shipping:</span>{" "}
              <span className="font-light">
                Currently domestic only. If you’d like us to ship abroad, write to{" "}
                <a className="underline" href="mailto:care@tashn.in">care@tashn.in</a>.
              </span>
            </li>

            {/* Lost/Damaged */}
            <li>
              <span className="font-medium">Lost or Damaged Parcels:</span>{" "}
              <span className="font-light">
                If your package arrives visibly damaged, refuse delivery and inform us. If already accepted, share unboxing photos/videos within <strong>24 hours</strong> so we can raise it with the courier.
              </span>
            </li>

            {/* Packaging */}
            <li>
              <span className="font-medium">Packaging:</span>{" "}
              <span className="font-light">
                Orders are shipped in tamper-evident packaging. Do not accept a parcel that appears opened or resealed; contact us immediately.
              </span>
            </li>
          </ul>

          {/* Actions */}
          <div className="mt-8 flex gap-3">
            <Link
              to="/contact"
              className="uppercase text-xs px-6 py-2 border border-dark text-dark hover:bg-dark hover:text-light"
            >
              Need help? Contact us
            </Link>
            <Link
              to="/return-policy"
              className="uppercase text-xs px-6 py-2 border border-hover-tint text-dark hover:bg-surface"
            >
              Returns &amp; Exchanges
            </Link>
          </div>

          {/* Meta */}
          <p className="mt-6 text-xxs uppercase text-subtext">
            Dispatch Mon–Sat • Support 10:00–18:00 IST • Typical response within 24 hours
          </p>
        </div>
      </div>
    </div>
  );
}