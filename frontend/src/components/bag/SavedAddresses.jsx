import React from "react";

export default function SavedAddresses({
  addresses = [],
  selectedId,
  onSelect,
  handleNewAddress,
}) {
  const addrId = (addr, idx) => addr?._id ?? addr?.id ?? String(idx);

  const fmtPhone = (p) => (p ? `+91 ${p}` : "");
  const fmtLine = (addr) =>
    [addr?.line1, addr?.line2, prettyLandmark(addr?.landmark), addr?.city]
      .filter(Boolean)
      .join(", ");

  const fmtRegion = (addr) =>
    [addr?.state, addr?.pincode].filter(Boolean).join(" - ");

  function prettyLandmark(landmark) {
    if (!landmark) return "";
    const first = String(landmark).trim().split(" ")[0].toLowerCase();
    return ["near", "nearby"].includes(first) ? landmark : `Near ${landmark}`;
  }

  if (!addresses?.length) {
    return (
      <div className="border border-hover-tint bg-surface p-6 text-sm text-subtext">
        No saved addresses found.
        <div className="mt-3">
          <button
            type="button"
            onClick={handleNewAddress}
            className="uppercase text-xs underline text-dark enabled:cursor-pointer"
          >
            Deliver to New Address
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Info text */}
      <p className="text-xxs uppercase text-subtext">
        Select one of the saved addresses
      </p>
      {addresses.map((addr, index) => {
        const id = addrId(addr, index);
        const selected = id === selectedId;

        return (
          <label
            key={id}
            className={`block p-4 border cursor-pointer ${
              selected ? "border-dark bg-surface" : "border-border hover:border-dark/30"
            }`}
          >
            <input
              type="radio"
              name="saved-address"
              className="sr-only"
              checked={selected}
              onChange={() => onSelect?.(id)}
            />
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-light text-dark uppercase truncate">
                  {addr?.fullName}
                  {addr?.phone ? `, ${fmtPhone(addr.phone)}` : ""}
                </p>
                <p className="text-sm font-light text-dark break-words">
                  {fmtLine(addr)}
                </p>
                <p className="text-sm font-light text-dark">
                  {fmtRegion(addr)}{addr?.country ? `, ${addr.country}` : ""}
                </p>
              </div>

              {addr?.isDefault && (
                <span className="h-fit px-2 py-0.5 border border-dark text-xxs uppercase">
                  Default
                </span>
              )}
            </div>
          </label>
        );
      })}

      {/* New address CTA */}
      <div className="flex items-center gap-2 pt-2">
        {/* <span className="text-xs text-subtext">OR</span> */}
        <button
          type="button"
          onClick={handleNewAddress}
          className="text-xs uppercase underline text-dark enabled:cursor-pointer"
        >
          Deliver to New Address
        </button>
      </div>
      {/* <div>
        <p className='text-center text-xs text-subtext mt-8'>OR</p>
      </div>
      <button onClick={handleNewAddress} className='w-full px-4 py-4 mt-4 text-xs uppercase text-dark enabled:cursor-pointer text-center border-1 border-dashed border-border hover:underline'>
        Deliver to new address
      </button> */}
    </div>
  );
}
