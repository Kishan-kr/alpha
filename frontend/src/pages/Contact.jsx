import React from "react";
import { Link } from "react-router-dom";

export default function Contact() {
  return (
    <div className="bg-light px-6 py-20 md:px-24 md:py-24">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-xl uppercase font-gfs-didot text-dark">
          Contact Us
        </h1>

        {/* lead */}
        <p className="mt-4 text-sm text-subtext">
          Quick help with orders, returns, sizing, or general support.
        </p>

        {/* compact channels */}
        <div className="mt-8 space-y-3 text-sm text-dark">
          <p>
            <span className="uppercase text-xxs text-subtext">Email</span><br />
            <a href="mailto:care@tashn.in" className="underline">care@tashn.in</a>
          </p>
          <p>
            <span className="uppercase text-xxs text-subtext">Phone</span><br />
            <a href="tel:+918929358439" className="underline">+91 89293 58439</a>
          </p>
          <p className="text-subtext">
            Returns or exchanges? Read the{" "}
            <Link to="/returns" className="underline">Returns &amp; Exchange Policy</Link>.
          </p>
        </div>

        {/* quick actions */}
        <div className="mt-8 flex gap-3">
          <a
            href="mailto:care@tashn.in"
            className="uppercase text-xs px-6 py-2 border border-dark text-dark hover:bg-dark hover:text-light"
          >
            Email support
          </a>
          <a
            href="tel:+918929358439"
            className="uppercase text-xs px-6 py-2 border border-hover-tint text-dark hover:bg-surface"
          >
            Call us
          </a>
        </div>

        {/* hours */}
        <p className="mt-6 text-xxs uppercase text-subtext">
          Hours: Mon–Sat, 10:00–18:00 IST • Typical response within 24 hours
        </p>

        {/* divider */}
        <div className="mt-10 border-t border-hover-tint" />

        {/* legal / registered office */}
        <section className="mt-8 text-sm">
          <h2 className="uppercase text-xxs tracking-wide text-subtext">Registered Office (no walk-ins)</h2>
          <address className="not-italic mt-3 text-dark">
            <div>Tashn</div>
            <div>H No. 14 A/B, Gali Number 20, Nyader Enclave, Vikas Nagar</div>
            <div>West Delhi, Delhi, 110059</div>
            <div>India</div>
          </address>
        </section>

        {/* grievance officer */}
        <section className="mt-8 text-sm">
          <h2 className="uppercase text-xxs tracking-wide text-subtext">Grievance Officer</h2>
          <p className="mt-3 text-dark">
            Name: <span className="uppercase">Anuj</span>
          </p>
          <p className="text-dark">
            Email: <a href="mailto:grievance@tashn.in" className="underline">grievance@tashn.in</a>
          </p>
        </section>
      </div>
    </div>
  );
}