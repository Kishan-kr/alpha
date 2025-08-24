import React, { useEffect } from "react";
import { X, LoaderCircle } from "lucide-react";

export default function CancelOrderModal({ onClose, onConfirm, loading }) {
  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.classList.add("overflow-hidden", "h-screen");

    return () => {
      document.body.classList.remove("overflow-hidden", "h-screen");
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm();
  };

  return (
    <div className="fixed inset-0 z-50 bg-light/80 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-light p-6 sm:p-10 w-full max-w-md relative border border-hover-tint animate-fade-in"
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
          Cancel Order
        </h2>
        <p className="text-xs text-subtext font-light mb-8">
          Are you sure you want to cancel this order? This action cannot be undone.
        </p>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="uppercase text-xs px-5 py-2 border border-hover-tint text-subtext hover:text-dark enabled:cursor-pointer"
          >
            Keep Order
          </button>
          <button
            type="submit"
            disabled={loading}
            className="uppercase text-xs px-5 py-2 border bg-dark text-light hover:opacity-90 enabled:cursor-pointer flex items-center justify-center"
          >
            {loading ? (
              <span className="animate-spin">
                <LoaderCircle className="w-4 h-4" />
              </span>
            ) : (
              "Yes, Cancel"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}