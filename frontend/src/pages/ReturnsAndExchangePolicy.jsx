import React from "react";
import { Link } from "react-router-dom";

export default function ReturnsAndExchangePolicy() {
  return (
    <div className="bg-light px-6 py-20 md:px-24 md:py-24">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-xl md:text-xl uppercase font-gfs-didot text-dark">
          Return &amp; Exchange Policy
        </h1>

        <div className="mt-6 space-y-5 text-sm text-dark">
          <p className="uppercase text-xxs tracking-wide text-subtext">
            TASHN — simple, clear, and fast
          </p>

          <p>Got a change of heart? No worries.</p>
          <p>
            We want you to love what you wear. Returns and exchanges are easy and
            designed around how you actually shop.
          </p>

          <h2 className="uppercase text-xs tracking-wide text-subtext mt-6">
            Here’s the rundown
          </h2>

          {/* square bullets, smaller text, heading medium + copy light */}
          <ul className="list-[square] pl-5 space-y-3 text-sm">
            <li>
              <span className="font-medium">Order Cancellation:</span>{" "}
              <span className="font-light">
                You can cancel an order within <strong>24 hours</strong> of placing it, as long as it hasn’t moved to <em>Shipped / Out for Delivery</em>. For prepaid orders, we initiate a refund to the original payment method. For COD, no amount is collected.
              </span>
            </li>

            <li>
              <span className="font-medium">Returns &amp; Exchanges Window:</span>{" "}
              <span className="font-light">
                You can request a <em>return or exchange</em> within <strong>3 days</strong> from the date the item was delivered. These are <strong>item-level</strong> requests (not whole-order) and apply to original purchases only.
              </span>
            </li>

            <li>
              <span className="font-medium">Eligibility:</span>{" "}
              <span className="font-light">
                Item must be unused, unwashed, with tags intact and in original packaging. Please include all accessories that came with the product.
              </span>
            </li>

            <li>
              <span className="font-medium">Initiating a Return:</span>{" "}
              <span className="font-light">
                Go to <em>My Orders → Order Details</em>, choose the item, and tap <em>Return</em>. A return request is created and tracked in your orders. We schedule a pickup and process your refund after QC.
              </span>
            </li>

            <li>
              <span className="font-medium">Initiating an Exchange:</span>{" "}
              <span className="font-light">
                Go to <em>My Orders → Order Details</em>, choose the item, and tap <em>Exchange</em>. Select your new size (same product). We create a new <strong>Exchange order</strong> linked to the original. Once we receive and verify the original item, the replacement ships. If your requested variant is unavailable, we’ll process a refund instead.
              </span>
            </li>

            <li>
              <span className="font-medium">Pick-up &amp; Processing:</span>{" "}
              <span className="font-light">
                Pickup usually happens in <strong>1–3 business days</strong>. Items typically reach us within <strong>6–7 days</strong>. After QC, we process the refund or ship your exchange within <strong>2–3 business days</strong>.
              </span>
            </li>

            <li>
              <span className="font-medium">Self-Return (if pickup not available):</span>{" "}
              <span className="font-light">
                You may self-ship within <strong>5 days</strong> of requesting the return. Please place a note with your <em>Order Number</em> and <em>Return ID</em> inside the package.
              </span>
            </li>

            <li>
              <span className="font-medium">Refunds:</span>{" "}
              <span className="font-light">
                For prepaid returns/cancellations, we refund to the original payment method after QC. For COD returns, we’ll request UPI/bank details and issue the refund after QC. Partial returns in a multi-item order are refunded for the returned item(s) only. Exchanges are like-for-like; if the replacement isn’t available, we’ll refund instead.
              </span>
            </li>
          </ul>

          <div className="mt-8 flex gap-3">
            <Link
              to="/contact"
              className="uppercase text-xs px-6 py-2 border border-dark text-dark hover:bg-dark hover:text-light"
            >
              Need help? Contact us
            </Link>
            <Link
              to="/shipping"
              className="uppercase text-xs px-6 py-2 border border-hover-tint text-dark hover:bg-surface"
            >
              Shipping &amp; Delivery
            </Link>
          </div>

          <p className="mt-6 text-xxs uppercase text-subtext">
            Note: You’ll see separate <em>Return</em> or <em>Exchange</em> orders in
            your account when a request is raised; these are linked to the original
            order for tracking.
          </p>
        </div>
      </div>
    </div>
  );
}
