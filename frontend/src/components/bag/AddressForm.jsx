// src/components/bag/AddressForm.jsx
import { LoaderCircle } from "lucide-react";
import React from "react";
import { LOADING } from "../../constants/appConstants";

export default function AddressForm({
  formData = {},
  onChange,
  onSubmit,
  isLoading = false,
}) {
  const handleDigits = (name, max) => (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, max);
    onChange?.({ target: { name, value } });
  };

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-6 borde border-hover-tint p- bg-light"
    >
      <h3 className="text-sm uppercase font-light text-dark">Enter Delivery Address</h3>

      {/* Name / Phone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName || ""}
          onChange={onChange}
          autoComplete="name"
          minLength={3}
          required
          className="w-full rounded-none appearance-none border border-border px-3 py-2 text-sm text-dark placeholder:text-border focus:outline-none"
        />
        {/* Phone with fixed +91 prefix */}
        <div className="w-full flex">
          <span
            className="select-none inline-flex items-center px-3 border border-border border-r-0 bg-surface text-sm text-subtext rounded-none"
            aria-hidden="true"
          >
            +91
          </span>
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone || ""}
            onChange={handleDigits("phone", 10)}
            autoComplete="tel-national"
            inputMode="numeric"
            maxLength={10}
            minLength={10}
            required
            className="w-full rounded-none appearance-none border border-border px-3 py-2 text-sm text-dark placeholder:text-border focus:outline-none"
          />
        </div>
      </div>

      {/* Address lines */}
      <input
        type="text"
        name="line1"
        placeholder="Address Line 1"
        value={formData.line1 || ""}
        onChange={onChange}
        autoComplete="address-line1"
        required
        className="w-full rounded-none appearance-none border border-border px-3 py-2 text-sm text-dark placeholder:text-border focus:outline-none"
      />
      <input
        type="text"
        name="line2"
        placeholder="Address Line 2 (Optional)"
        value={formData.line2 || ""}
        onChange={onChange}
        autoComplete="address-line2"
        className="w-full rounded-none appearance-none border border-border px-3 py-2 text-sm text-dark placeholder:text-border focus:outline-none"
      />

      {/* City / State / Pincode */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          name="city"
          placeholder="City"
          value={formData.city || ""}
          onChange={onChange}
          autoComplete="address-level2"
          required
          className="w-full rounded-none appearance-none border border-border px-3 py-2 text-sm text-dark placeholder:text-border focus:outline-none"
        />
        <input
          type="text"
          name="state"
          placeholder="State"
          value={formData.state || ""}
          onChange={onChange}
          autoComplete="address-level1"
          required
          className="w-full rounded-none appearance-none border border-border px-3 py-2 text-sm text-dark placeholder:text-border focus:outline-none"
        />
        <input
          type="text"
          name="pincode"
          placeholder="Pincode"
          value={formData.pincode || ""}
          onChange={handleDigits("pincode", 6)}
          inputMode="numeric"
          autoComplete="postal-code"
          maxLength={6}
          minLength={6}
          required
          className="w-full rounded-none appearance-none border border-border px-3 py-2 text-sm text-dark placeholder:text-border focus:outline-none"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="rounded-none flex justify-center max-w-44 w-full bg-dark text-light text-xs uppercase px-6 py-3 enabled:cursor-pointer hover:opacity-90"
      >
        {isLoading ? <span className='animate-spin'><LoaderCircle className='w-4 h-4' /></span> : 'Save and continue'}
      </button>
    </form>
  );
}