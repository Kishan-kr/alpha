import { Link } from "react-router-dom";
import React from "react";

export default function Footer() {
  return (
    <footer className="bg-surface text-white px-6 md:px-16 py-14 pb-2">
      <div className="grid md:grid-cols-4 gap-10 text-sm">
        {/* About */}
        <div className="md:col-span-1">
          <h3 className="uppercase font-semibold tracking-widest mb-4">
            Welcome to Tashn
          </h3>
          <p className="text-white/80 leading-relaxed">
          Born for the bold and built for the streets, our mission is to redefine men’s casualwear with fits that speak louder than words. Every thread carries attitude. Every drop delivers edge.
          From sharp silhouettes to standout essentials, TASHN is made for those who walk with intent, dress with purpose, and never settle for basic.
          </p>
        </div>

        {/* Customer Service */}
        <div>
          <h3 className="uppercase font-semibold tracking-widest mb-4">
            Customer Service
          </h3>
          <ul className="space-y-2 text-white/80">
  {[
    { label: "About Us", to: "/about" },
    { label: "Contact Us", to: "/contact" },
    { label: "Returns and Exchange Policy", to: "/returns" },
    { label: "Terms Of Service", to: "/terms" },
    { label: "Privacy Policy", to: "/privacy" },
    { label: "Shipping and Delivery", to: "/shipping" },
  ].map((link) => (
    <li key={link.to}>
      <Link
        to={link.to}
        className="relative group inline-block overflow-hidden"
      >
        <span className="group-hover:text-white transition-colors duration-300">
          {link.label}
        </span>
        <span
          className="absolute bottom-0 left-0 h-[1px] w-0 bg-[var(--olive-green)] transition-all duration-300 group-hover:w-full"
        />
      </Link>
    </li>
  ))}
</ul>

        </div>

        {/* Our Commitment */}
        <div>
          <h3 className="uppercase font-semibold tracking-widest mb-4">
            Our Commitment
          </h3>
          <ul className="text-white/80 space-y-2">
            <li>✔ 100% Satisfaction Guarantee</li>
            <li>✔ Customer Support</li>
            <li>✔ Premium Quality Products</li>
            <li>✔ Secured Transactions</li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="uppercase font-semibold tracking-widest mb-4">
            Newsletter
          </h3>
          <p className="text-white/80 mb-4">
            Subscribe to our newsletter now and get updates on all the exciting offers from Tashn.
          </p>
          <form className="space-y-3">
            <input
              type="email"
              placeholder="Enter your email address"
              className="w-full bg-transparent border border-white/50 px-4 py-2 text-sm text-white placeholder:text-white/50 focus:outline-none"
            />
            <button
              type="submit"
              // className="bg-[#6A5ACD] hover:bg-[#4B3EBB] px-4 py-2 uppercase text-xs font-semibold tracking-widest text-white transition-colors duration-300"
              className="bg-[var(--olive-green)] hover:bg-[var(--olive-green)] px-4 py-2 uppercase text-xs font-semibold tracking-widest text-white transition-colors duration-300"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
      <h3 className="text-[7rem] md:text-[18rem] text-white/70 uppercase overflow-y-hidden py-0 leading-52 italic text-right mt-8">Tashn</h3>
    </footer>
  );
}