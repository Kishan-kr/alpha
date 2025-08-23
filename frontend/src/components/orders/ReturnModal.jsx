import React, { useState } from "react";
import { X, LoaderCircle, Check } from "lucide-react";
import { showErrorToastWithIcon } from "../../utils/customToasts";

const REASONS = [
  "Size issue",
  "Wrong item delivered",
  "Damaged item",
  "Not as described",
  "Other",
];

export default function ReturnModal({ onClose, onConfirm, loading }) {
  const [reason, setReason] = useState(REASONS[0]);
  const [otherReason, setOtherReason] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalReason = reason === "Other" ? otherReason.trim() : reason;
    if (!finalReason) {
      showErrorToastWithIcon('Please provide a reason.')
      return;
    };
    onConfirm(finalReason);
  };

  return (
    <div className="fixed inset-0 z-50 bg-light/80 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-light p-6 sm:p-10 w-full max-w-lg relative border border-hover-tint animate-fade-in"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 text-subtext hover:text-dark enabled:cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Heading */}
        <h2 className="text-lg uppercase text-dark tracking-wide font-light mb-3">
          Return Item
        </h2>
        <p className="text-xs text-subtext font-light mb-6">
          Please select a reason for returning this item
        </p>

        {/* Custom options */}
        <div className="space-y-2 mb-6">
          {REASONS.map((r) => (
            <button
              key={r}
              type="button"
              role="radio"
              onClick={() => setReason(r)}
              className={`w-full text-left px-3 py-2 border text-sm flex justify-between items-center
                ${reason === r
                  ? "border-dark bg-surface text-dark"
                  : "border-border text-subtext hover:border-dark hover:text-dark"
                }`}
            >
              <span>{r}</span>
              {reason === r && <Check className="w-4 h-4" />}
            </button>
          ))}
        </div>

        {/* Other Reason Input */}
        {reason === "Other" && (
          <textarea
            value={otherReason}
            onChange={(e) => setOtherReason(e.target.value)}
            className="w-full p-3 mb-6 border border-border outline-none focus:ring-2 focus:ring-light text-sm"
            placeholder="Enter your reason"
            rows={3}
            minLength={5}
            maxLength={500}
            required
            autoFocus
          />
        )}

        {/* Submit Button */}
        <button
          disabled={loading}
          className="bg-dark flex items-center justify-center uppercase font-light text-sm text-light w-full py-3 enabled:cursor-pointer"
        >
          {loading ? (
            <span className="animate-spin">
              <LoaderCircle className="w-5 h-5" />
            </span>
          ) : (
            "Submit Return Request"
          )}
        </button>
      </form>
    </div>
  );
}