import React, { useState } from "react";
import { showErrorToastWithIcon, showBagSuccessToast } from '../../utils/customToasts';
import { Link } from "react-router-dom";
import api from "../../api/axiosClient";

export default function Footer() {
  const year = new Date().getFullYear();
  const [loading, setLoading] = useState(false);

  const navCompany = [
    { label: "About Us", to: "/about" },
    { label: "Contact Us", to: "/contact" },
    { label: "My Orders", to: "/orders" },
  ];

  const navPolicies = [
    { label: "Returns and Exchange Policy", to: "/return-policy" },
    { label: "Terms Of Service", to: "/terms" },
    { label: "Privacy Policy", to: "/privacy-policy" },
    { label: "Shipping and Delivery", to: "/shipping" },
  ];

  const LinkItem = ({ to, label }) => (
    <li>
      <Link
        to={to}
        className="relative group font-light inline-block overflow-hidden"
      >
        <span className="group-hover:underline transition-colors duration-300">
          {label}
        </span>
        <span
          className="absolute bottom-0 left-0 h-[1px] w-0 bg-[var(--olive-green)] transition-all duration-300 group-hover:w-full"
        />
      </Link>
    </li>
  );


  const onSubscribe = async (e) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target;
    const email = form.email.value;
    try {
      const res = await api.post("/newsletter/subscribe", { email });
      if (res.data.status) {
        showBagSuccessToast("Subscribed successfully!");
        form.reset();
      } else {
        showErrorToastWithIcon(res.data.error || "Subscription failed.");
      }
    } catch (err) {
      showErrorToastWithIcon(err?.response?.data?.error || "Network error. Please try again.");
    }
    setLoading(false);
  };

  return (
    <footer className="bg-light text-dark px-5 md:px-15 py-14 pb-12">
      {/* upper grid */}
      <div className="grid md:grid-cols-3 gap-12 text-sm">
        {/* Company */}
        <div>
          <h3 className="uppercase tracking-wide mb-4 text-xs font-medium">
            Company
          </h3>
          <ul className="space-y-2">
            {navCompany.map((l) => (
              <LinkItem key={l.to} {...l} />
            ))}
          </ul>
        </div>

        {/* Policies */}
        <div>
          <h3 className="uppercase tracking-wide mb-4 text-xs font-medium">
            Policies
          </h3>
          <ul className="space-y-2">
            {navPolicies.map((l) => (
              <LinkItem key={l.to} {...l} />
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="uppercase tracking-wide mb-4 text-xs font-medium">
            Newsletter
          </h3>
          <p className="text-dark/80 mb-4 text-sm leading-relaxed">
            Get early access to drops and updates from Tashn.
          </p>
          <form className="space-y-3" onSubmit={onSubscribe}>
            <input
              id="newsletter-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="Enter your email address"
              className="w-full bg-transparent border border-border px-4 py-2 text-sm text-dark placeholder:text-border focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full border border-[var(--olive-green)] text-dark px-4 py-2 uppercase text-xs font-medium tracking-widest hover:bg-[var(--olive-green)]/10 transition-colors duration-300 enabled:cursor-pointer disabled:opacity-60"
            >
              {loading ? "Subscribing..." : "Subscribe"}
            </button>
            <p className="text-xxs text-subtext uppercase">
              By subscribing you agree to our{" "}
              <Link to="/privacy-policy" className="underline">
                Privacy Policy
              </Link>
              .
            </p>
          </form>
        </div>
      </div>

      {/* divider */}
      <div className="mt-12 border-t border-hover-tint" />

      {/* bottom bar */}
      <div className="mt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xxs uppercase text-subtext">
        <p>© {year} Tashn. All rights reserved.</p>
        <a
          href="mailto:care@tashn.in"
          className="hover:underline transition-colors duration-200"
        >
          care@tashn.in
        </a>
      </div>
    </footer>
  );
}
