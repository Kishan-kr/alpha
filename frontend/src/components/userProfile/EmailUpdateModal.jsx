import React, { useEffect, useState } from 'react';
import { LoaderCircle, X } from 'lucide-react';
import OTPInput from '../common/OtpInput';
import { showErrorToastWithIcon } from '../../utils/customToasts';
import { useDispatch, useSelector } from 'react-redux';
import { sendOtpOnEmail, verifyEmailOtp } from '../../store/actions/userAction';
import { LOADING, OTP_RESEND_TIMEOUT } from '../../constants/appConstants';
import toast from 'react-hot-toast';

const SEND_OTP = "SEND_OTP";
const VERIFY_OTP = "VERIFY_OTP";

function EmailUpdateModal({ email, onClose }) {
  const [step, setStep] = useState(SEND_OTP); // edit, otp, success
  const [newEmail, setNewEmail] = useState(email);
  const [otp, setOtp] = useState('');
  const [resendTimer, setResendTimer] = useState(30); // in seconds
  const [canResend, setCanResend] = useState(false);
  const { phoneStatus, verifyStatus } = useSelector(state => state.user);

  const dispatch = useDispatch();

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.classList.add("overflow-hidden", "h-screen");

    return () => {
      document.body.classList.remove("overflow-hidden", "h-screen");
    };
  }, []);

  useEffect(() => {
    let timer;
    if (step === VERIFY_OTP && resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    if (resendTimer === 0) setCanResend(true);
    return () => clearInterval(timer);
  }, [step, resendTimer]);

  const dispatchOtp = async () => {
    const result = await dispatch(sendOtpOnEmail(newEmail));

    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('Code has been sent on your Email')
      setStep(VERIFY_OTP);
      setResendTimer(OTP_RESEND_TIMEOUT);
      setCanResend(false);
    } else {
      const errMsg = result.payload || 'Failed to send code';
      showErrorToastWithIcon(errMsg);
    }
  }

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!newEmail.includes('@')) return showErrorToastWithIcon('Enter a valid email.');
    dispatchOtp();
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) return showErrorToastWithIcon('Enter valid 6-digit Code.');

    const result = await dispatch(verifyEmailOtp({email: newEmail, otp}));

    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('Your email has been updated successfully');
      onClose();
    } else {
      const errMsg = result.payload || 'Email verification failed';
      showErrorToastWithIcon(errMsg);
    }
  };

  const handleResendOtp = () => {
    if (!canResend) return;
    dispatchOtp();
    setResendTimer(OTP_RESEND_TIMEOUT);
    setCanResend(false);
  };

  const handlechangeOtp = (otp) => {
    setOtp(otp)
  };

  return (
    <div className="fixed inset-0 z-50 bg-light/80 flex items-center justify-center">
      {/* <div className="bg-surface p-6 sm:p-10 w-full max-w-lg relative shadow-xl animate-fade-in"> */}
      <form 
      onSubmit={step === SEND_OTP ? handleEmailSubmit : handleOtpSubmit}
      className="bg-light p-6 sm:p-10 w-full max-w-lg relative border border-hover-tint animate-fade-in">
        <button
          type='button'
          onClick={onClose}
          className="absolute top-4 right-4 text-subtext hover:text-dark enabled:cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {step === SEND_OTP && (
          <>
            <h2 className="text-lg uppercase text-dark tracking-wide font-light mb-3">Update Email</h2>
            <p className="text-xs text-subtext font-light mb-10">We'll send a 6-digit code to your new email</p>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              autoFocus
              className="w-full p-3 mb-6  border border-border outline-none focus:ring-2 focus:ring-light"
              placeholder="Enter new email"
            />
            <button
              type="submit"
              disabled={phoneStatus === LOADING}
              className="bg-dark flex items-center justify-center uppercase font-light text-sm text-light w-full py-3 enabled:cursor-pointer"
            >
              {phoneStatus === LOADING ? <span className='animate-spin'><LoaderCircle className='w-5 h-5' /></span> : "Send Code"}
            </button>
          </>
        )}

        {step === VERIFY_OTP && (
          <>
            <h2 className="text-lg uppercase text-dark tracking-wide font-light mb-3">Verify Email</h2>
            <p className="text-sm text-subtext font-light mb-10">Enter the verification code sent to <span className="text-dark font-medium">{newEmail}</span></p>
            <OTPInput length={6} onChangeOTP={handlechangeOtp} />

            <div className="text-sm text-subtext mt-6 font-light">
              <span>Didn't receive the code? </span>
              {canResend ? (
                <button
                  type='button'
                  onClick={handleResendOtp}
                  className="text-dark underline enabled:cursor-pointer"
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
              className="w-full p-3 mb-4 bg-accent border border-border outline-none focus:ring-2 focus:ring-light"
              placeholder="Enter 6-digit OTP"
              maxLength={6}
            /> */}

            <button
              type='submit'
              disabled={verifyStatus === LOADING}
              className="mt-8 bg-dark flex items-center justify-center uppercase font-light text-sm text-light w-full py-3 enabled:cursor-pointer"
            >
              {verifyStatus === LOADING ? <span className='animate-spin'><LoaderCircle className='w-5 h-5' /></span> : "Verify Code"}
            </button>
          </>
        )}

      </form>
    </div>
  );
}

export default EmailUpdateModal;