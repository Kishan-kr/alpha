import React from "react";

/**
 * ShippingInfo
 * Minimal address + (optional) shipment info block.
 *
 * Props:
 *  - address: {
 *      name, phone, line1, line2, city, state, pincode, country
 *    }
 *  - shipment?: {
 *      carrier?: string,
 *      trackingNumber?: string,
 *      status?: string
 *    }
 */
export default function ShippingInfo({ address = {}, shipment = {} }) {
  return (
    <section className="border border-hover-tint bg-light">
      <div className="px-5 py-4 md:px-6 border-b border-hover-tint text-sm uppercase text-dark">
        Shipping
      </div>

      <div className="px-5 md:px-6 py-5 text-sm">
        {/* Address */}
        <div className="text-dark">
          {address?.fullName}
          {address?.fullName && address?.phone ? <> , {address.phone}</> : address?.phone || null}
        </div>
        <div className="text-subtext mt-1">
          {address?.line1}
          {address?.line2 ? `, ${address.line2}` : ""}
        </div>
        <div className="text-subtext">
          {address?.city}
          {address?.state ? `, ${address.state}` : ""} {address?.pincode}
        </div>
        <div className="text-subtext">{address?.country}</div>

        {/* Shipment (optional) */}
        {(shipment?.carrier || shipment?.trackingNumber || shipment?.status) && (
          <>
            <div className="mt-5 h-px bg-dark/10" />
            <div className="mt-4 grid grid-cols-1 gap-2 text-subtext">
              {shipment?.carrier && (
                <div className="flex items-center justify-between">
                  <span>Carrier</span>
                  <span className="uppercase">{shipment.carrier}</span>
                </div>
              )}
              {shipment?.trackingNumber && (
                <div className="flex items-center justify-between">
                  <span>Tracking No.</span>
                  <span className="truncate max-w-[60%] text-right">{shipment.trackingNumber}</span>
                </div>
              )}
              {shipment?.status && (
                <div className="flex items-center justify-between">
                  <span>Status</span>
                  <span className="uppercase">{shipment.status}</span>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}