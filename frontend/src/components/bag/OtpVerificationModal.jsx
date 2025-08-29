import React, { useEffect, useMemo, useState } from "react";
import { X, LoaderCircle } from "lucide-react";
import toast from "react-hot-toast";
import OtpInput from "./OtpInput";
import { showErrorToastWithIcon } from "../../utils/customToasts";

/**
 * OTP Verification Modal
 *
 * Props:
 * - phone: string (required) — e.g. "9876543210"
 * - loading?: boolean        — disables actions while verifying
 * - onClose: () => void
 * - onConfirm: (otpCode: string) => Promise<void> | void
 * - onResend?: () => Promise<void> | void
 * - resendTimeoutSec?: number (default 30)
 * - otpLength?: number (default 6)
 */
export default function OtpVerificationModal({
  phone = "",
  loading = false,
  onClose,
  onConfirm,
  onResend,
  resendTimeoutSec = 30,
  otpLength = 6,
}) {
  const [otp, setOtp] = useState(Array(otpLength).fill(""));
  const [timer, setTimer] = useState(resendTimeoutSec);

  // mask phone nicely for display
  const maskedPhone = useMemo(() => {
    const p = String(phone || "");
    if (p.length <= 4) return p;
    return `${p.slice(0, 2)}XXXX${p.slice(-4)}`;
  }, [phone]);

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.classList.add("overflow-hidden", "h-screen");

    return () => {
      document.body.classList.remove("overflow-hidden", "h-screen");
    };
  }, []);

  // countdown for resend button (only if onResend provided)
  useEffect(() => {
    if (!onResend) return;
    if (timer <= 0) return;
    const id = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timer, onResend]);

  // reset input if phone changes or when reopened
  useEffect(() => {
    setOtp(Array(otpLength).fill(""));
    setTimer(resendTimeoutSec);
  }, [phone, otpLength, resendTimeoutSec]);

  const code = Array.isArray(otp) ? otp.join("") : String(otp || "");
  const isComplete = code.length === otpLength && /^[0-9]+$/.test(code);

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    if (!isComplete) {
      showErrorToastWithIcon(`Please enter the ${otpLength}-digit OTP`);
      return;
    }
      await onConfirm?.(code);
  };

  const handleResend = async () => {
    if (!onResend || timer > 0) return;
    try {
      await onResend();
      toast.success("OTP sent again");
      setOtp(Array(otpLength).fill(""));
      setTimer(resendTimeoutSec);
    } catch (err) {
      showErrorToastWithIcon(err?.message || "Failed to resend OTP");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-light/80 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-light p-6 sm:p-10 w-full max-w-md relative border border-hover-tint"
      >
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-subtext hover:text-dark enabled:cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Heading */}
        <h2 className="text-lg uppercase text-dark tracking-wide font-light mb-2">
          Verify Mobile
        </h2>
        <p className="text-xs text-subtext font-light mb-6">
          Enter the OTP sent to <span className="text-dark">+91 {maskedPhone}</span>
        </p>

        {/* OTP input */}
        <OtpInput
          value={otp}
          length={otpLength}
          onChange={(arr) => setOtp(arr)}
          onComplete={() => { }}
          className="gap-2 sm:gap-3"
          inputClassName="w-10 h-12 sm:w-12 sm:h-12 text-center text-base tracking-widest border border-border bg-light outline-none focus:border-dark rounded-none"
        />

        {/* Resend link */}
        {onResend && (
          <div className="mt-4 text-xxs uppercase text-subtext">
            {timer > 0 ? (
              <span>Resend OTP in {timer}s</span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                className="underline enabled:cursor-pointer text-dark"
              >
                Resend OTP
              </button>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="mt-8 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="uppercase text-xs px-5 py-2 border border-hover-tint text-subtext hover:text-dark enabled:cursor-pointer rounded-none"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !isComplete}
            className="uppercase text-xs px-5 py-2 bg-dark text-light enabled:cursor-pointer hover:opacity-90 rounded-none flex items-center justify-center"
          >
            {loading ? (
              <span className="animate-spin">
                <LoaderCircle className="w-4 h-4" />
              </span>
            ) : (
              "Verify"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}