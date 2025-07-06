import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import OTPInput from '../common/OtpInput';

function EmailUpdateModal({ email, onClose, onUpdate }) {
  const [step, setStep] = useState('edit'); // edit, otp, success
  const [newEmail, setNewEmail] = useState(email);
  const [otp, setOtp] = useState('');
  const [resendTimer, setResendTimer] = useState(30); // in seconds
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    let timer;
    if (step === 'otp' && resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    if (resendTimer === 0) setCanResend(true);
    return () => clearInterval(timer);
  }, [step, resendTimer]);

  const handleEmailSubmit = () => {
    if (!newEmail.includes('@')) return alert('Enter a valid email.');
    setStep('otp');
    setResendTimer(30);
    setCanResend(false);
    // TODO: Trigger OTP send logic
  };

  const handleOtpSubmit = () => {
    if (otp.length !== 6) return alert('Enter valid 6-digit Code.');
    // TODO: OTP verification logic
    setStep('success');
    onUpdate(newEmail);
    setTimeout(() => onClose(), 1500);
  };

  const handleResendOtp = () => {
    if (!canResend) return;
    setResendTimer(30);
    setCanResend(false);
    setOtp('');
    // TODO: Trigger resend OTP logic
  };

  const handlechangeOtp = (otp) => {
    setOtp(otp)
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-surface p-6 rounded-xl w-full max-w-md relative shadow-xl animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-subtext hover:text-dark"
        >
          <X className="w-5 h-5" />
        </button>

        {step === 'edit' && (
          <>
            <h2 className="text-2xl font-bold mb-3">Update Email</h2>
            <p className="text-sm text-subtext mb-4">We'll send a 6-digit code to your new email</p>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              autoFocus
              className="w-full p-3 mb-4 bg-accent border border-border rounded-md outline-none focus:ring-2 focus:ring-light"
              placeholder="Enter new email"
            />
            <button
              onClick={handleEmailSubmit}
              className="bg-dark text-light px-4 py-2 rounded-md font-semibold w-full hover:bg-subtext hover:text-dark transition"
            >
              Send Code
            </button>
          </>
        )}

        {step === 'otp' && (
          <>
            <h2 className="text-2xl font-bold mb-3">Verify Email</h2>
            <p className="text-sm text-subtext mb-6">Enter the verification code sent to <span className="text-dark font-medium">{newEmail}</span></p>
            <OTPInput length={6} onChangeOTP={handlechangeOtp}/>

            <div className="text-sm text-subtext mt-3">
              <span>Didn't receive the code? </span>
              {canResend ? (
                <button
                  onClick={handleResendOtp}
                  className="text-dark font-semibold hover:underline"
                >
                  Resend Code
                </button>
              ) : (
                <>Resend in <span className="font-semibold">{resendTimer}s</span></>
              )}
            </div>
            {/* <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-3 mb-4 bg-accent border border-border rounded-md outline-none focus:ring-2 focus:ring-light"
              placeholder="Enter 6-digit OTP"
              maxLength={6}
            /> */}
            <button
              onClick={handleOtpSubmit}
              className="bg-dark text-light px-4 py-2 mt-6 rounded-md font-semibold w-full hover:bg-subtext hover:text-dark transition"
            >
              Verify Code
            </button>
          </>
        )}

        {step === 'success' && (
          <div className="text-center text-green-400 font-semibold text-lg py-8">
            Email updated successfully!
          </div>
        )}
      </div>
    </div>
  );
}

export default EmailUpdateModal;