import React, { useRef } from "react";
import { OTP_LENGTH } from "../../constants/appConstants";

export default function OtpInput({ value, onChange, onComplete }) {
  const inputsRef = useRef([]);

  const handleChange = (val, index) => {
    if (/^\d?$/.test(val)) {
      const newOtp = [...value];
      newOtp[index] = val;
      onChange(newOtp);

      if (val && index < OTP_LENGTH - 1) {
        inputsRef.current[index + 1]?.focus();
      }

      if (onComplete && newOtp.every((d) => d !== "")) {
        onComplete(newOtp.join(""));
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (pasted) {
      const newOtp = Array(OTP_LENGTH).fill("");
      for (let i = 0; i < pasted.length; i++) {
        newOtp[i] = pasted[i];
      }
      onChange(newOtp);
      const focusIndex = pasted.length < OTP_LENGTH ? pasted.length : OTP_LENGTH - 1;
      inputsRef.current[focusIndex]?.focus();
    }
  };

  return (
    <div className="flex justify-between mb-6">
      {value.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (inputsRef.current[index] = el)}
          type="text"
          value={digit}
          onChange={(e) => handleChange(e.target.value, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          maxLength={1}
          autoFocus={index === 0}
          className="w-10 h-10 xs:w-12 xs:h-12 text-center text-base xs:text-lg border border-border bg-light outline-none focus:border-dark"
        />
      ))}
    </div>
  );
}