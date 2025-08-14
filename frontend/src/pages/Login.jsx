import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { LOADING, OTP_LENGTH, OTP_RESEND_TIMEOUT, REDIRECT_QUERY_PARAM, SUCCEEDED } from '../constants/appConstants';
import { useDispatch, useSelector } from 'react-redux';
import { sendOtpOnPhone, verifySmsOtp } from '../store/actions/userAction';
import { showErrorToastWithIcon } from '../utils/customToasts';
import toast from 'react-hot-toast';
import { LoaderCircle } from 'lucide-react';
import isSafeRedirectPath from '../utils/isSafeRedirectPath';

const SEND_OTP = "SEND_OTP";
const VERIFY_OTP = "VERIFY_OTP";

export default function Login() {
  const [formData, setFormData] = useState({
    phone: '',
    otp: Array(OTP_LENGTH).fill('')
  });
  const [step, setStep] = useState(SEND_OTP);
  const [timer, setTimer] = useState(OTP_RESEND_TIMEOUT);
  const {
    phoneStatus,
    verifyStatus
  } = useSelector(state => state.user);

  const inputsRef = useRef([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the `redirect` query param from the URL
  const searchParams = new URLSearchParams(location.search);
  const reDirParam = searchParams.get(REDIRECT_QUERY_PARAM);

  // Validate the redirect path
  const redirectTo = isSafeRedirectPath(reDirParam) ? reDirParam : '/';

  // Countdown for resend
  useEffect(() => {
    let interval;
    if (step === VERIFY_OTP && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const dispatchOtp = async () => {
    const result = await dispatch(sendOtpOnPhone(formData.phone));

    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('OTP has been sent on your phone')
      setStep(VERIFY_OTP);
      setTimer(OTP_RESEND_TIMEOUT);
    } else {
      const errMsg = result.payload || 'Failed to send OTP';
      showErrorToastWithIcon(errMsg);
    }
  }

  const handleSendOtp = (e) => {
    e.preventDefault();
    dispatchOtp();
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otpValue = formData.otp.join('');
    const result = await dispatch(verifySmsOtp({...formData, otp: otpValue}));

    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('OTP has been veirified successfully')
      navigate(redirectTo, {replace: true});
    } else {
      const errMsg = result.payload || 'OTP verification failed';
      showErrorToastWithIcon(errMsg);
    }
  };

  const handleOtpChange = (value, index) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...formData.otp];
      newOtp[index] = value;
      setFormData(prev => ({ ...prev, otp: newOtp }));

      // Focus next input if filled
      if (value && index < OTP_LENGTH - 1) {
        inputsRef.current[index + 1]?.focus();
      }
      // Focus previous if deleted
      // if (!value && index > 0) {
      //   inputsRef.current[index - 1]?.focus();
      // }
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !formData.otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (pasted) {
      const newOtp = [...formData.otp];
      for (let i = 0; i < pasted.length; i++) {
        newOtp[i] = pasted[i];
      }
      setFormData(prev => ({ ...prev, otp: newOtp }));
      const focusIndex = pasted.length < OTP_LENGTH ? pasted.length : OTP_LENGTH - 1;
      inputsRef.current[focusIndex]?.focus();
    }
  };

  const handleResendOtp = () => {
    if (timer === 0) {
      setTimer(OTP_RESEND_TIMEOUT);
      dispatchOtp();
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-6 bg-light text-dark py-20">
      <form
        onSubmit={step === SEND_OTP ? handleSendOtp : handleVerifyOtp}
        className="w-full max-w-md bg-light px-0 xs:px-10 p-10 xs:border border-hover-tint"
      >
        <h2 className="uppercase text-dark tracking-wide font-light mb-12 text-center text-lg">
          {step === SEND_OTP ? "Login to your account" : "Verify OTP"}
        </h2>

        {step === SEND_OTP && (
          <>
            {/* Phone */}
            <div className="mb-10">
              <label className="block text-xxs text-border uppercase tracking-wider mb-2">Phone</label>
              <div className="flex">
                <span className="pb-2 border-b min-w-12 xxs:min-w-16 border-border text-dark text-sm">+91</span>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  required
                  maxLength={10}
                  onChange={(e) => {
                    const digitsOnly = e.target.value.replace(/\D/g, "");
                    setFormData(prev => ({ ...prev, phone: digitsOnly }));
                  }}
                  className="w-full pb-2 ms-3 border-b border-border bg-light text-sm outline-none text-subtext"
                />
              </div>
              <p className="text-xs text-subtext font-light mt-2">
                Your phone number will be verified through an SMS OTP.
              </p>
            </div>

            <button
              type="submit"
              disabled={phoneStatus === LOADING}
              className="bg-dark flex items-center justify-center uppercase font-light text-sm text-light/80 w-full py-3 hover:text-light transition enabled:cursor-pointer"
            >
              {phoneStatus === LOADING ? <span className='animate-spin'><LoaderCircle className='w-5 h-5' /></span> : "Login"}
            </button>

            <p className="text-sm text-subtext mt-8 text-center">
              Don't have an account?{' '}
              <Link to="/signup" className="text-dark underline hover:text-accent">
                Signup
              </Link>
            </p>
          </>
        )}

        {step === VERIFY_OTP && (
          <>
            <p className="mb-8 text-center text-subtext font-light">
              Enter the 6-digit OTP sent to +91 {formData.phone}
            </p>

            {/* OTP Input Boxes */}
            <div className="flex justify-between mb-6">
              {formData.otp.map((digit, index) => (
                <input
                  key={index}
                  ref={el => inputsRef.current[index] = el}
                  type="text"
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, index)}
                  onKeyDown={(e) => handleOtpKeyDown(e, index)}
                  onPaste={(e) => handleOtpPaste(e)}
                  maxLength={1}
                  autoFocus={index === 0}
                  className="w-10 h-10 xs:w-12 xs:h-12 text-center text-base xs:text-lg border border-border bg-light outline-none focus:border-dark"
                />
              ))}
            </div>

            {/* Resend OTP */}
            <div className="mb-8 text-center text-sm">
              {timer > 0 ? (
                <span className="text-subtext">Resend OTP in {timer}s</span>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="text-dark underline enabled:cursor-pointer"
                >
                  Resend OTP
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={verifyStatus === LOADING}
              className="bg-dark flex items-center justify-center uppercase font-light text-sm text-light/80 w-full py-3 hover:text-light transition enabled:cursor-pointer"
            >
              {verifyStatus === LOADING ? <span className='animate-spin'><LoaderCircle className='w-5 h-5' /></span> : "Verify OTP"}
            </button>
          </>
        )}
      </form>
    </section>
  );
}