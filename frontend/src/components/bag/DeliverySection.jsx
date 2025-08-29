// src/components/bag/DeliverySection.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import BackButton from "./BackButton";
import SavedAddresses from "./SavedAddresses";
import AddressForm from "./AddressForm";
import NewAddressModal from "./NewAddressModal";
import OtpVerificationModal from "./OtpVerificationModal";
import { sendOtpOnPhone, verifySmsOtp } from "../../store/actions/userAction";
import { LOADING, OTP_RESEND_TIMEOUT } from "../../constants/appConstants";
import toast from "react-hot-toast";
import { showErrorToastWithIcon } from "../../utils/customToasts";

export default function DeliverySection({ handleNext, handleBack, setDeliveryAddress }) {
  const dispatch = useDispatch();
  const { isLoggedIn, userInfo, phoneStatus, verifyStatus } = useSelector((s) => s.user);

  // Addresses (logged-in)
  const initialAddresses = useMemo(() => userInfo?.addresses ?? [], [userInfo]);
  const defaultSelectedId = useMemo(() => {
    if (!initialAddresses.length) return null;
    const def = initialAddresses.find((a) => a.isDefault);
    return (def || initialAddresses[0])._id;
  }, [initialAddresses]);

  const [addresses, setAddresses] = useState(initialAddresses);
  const [selectedAddressId, setSelectedAddressId] = useState(defaultSelectedId);

  useEffect(() => {
    setAddresses(initialAddresses);
    setSelectedAddressId(defaultSelectedId);
  }, [initialAddresses, defaultSelectedId]);

  // side effect to set delivery address when user selects any address
  useEffect(() => {
    setDeliveryAddress(addresses.find(add => (add._id === selectedAddressId)));
  }, [selectedAddressId, addresses]);

  // Guest form
  const [formData, setFormData] = useState(() => ({
    fullName: [userInfo?.firstName, userInfo?.lastName].filter(Boolean).join(" ") || "",
    phone: userInfo?.phone || "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
  }));

  const handleChange = (eOrObj) => {
    if (!eOrObj) return;
    const { name, value } = eOrObj.target ? eOrObj.target : eOrObj;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Add new address (modal)
  const [showModal, setShowModal] = useState(false);

  const handleAddAddress = (e) => {
    e?.preventDefault?.();
    const { fullName, phone, line1, city, state, pincode } = formData;
    if (![fullName, phone, line1, city, state, pincode].every(Boolean)) return;

    const newId = `addr_${Date.now()}`;
    const newAddr = {
      _id: newId,
      fullName,
      phone,
      line1,
      line2: formData.line2 || "",
      city,
      state,
      pincode,
      isDefault: !addresses.length,
    };

    // const nextAddresses = [newAddr, ...addresses.map((a) => ({ ...a, isDefault: false }))];
    const nextAddresses = [newAddr, ...addresses];
    setAddresses(nextAddresses);
    setSelectedAddressId(newId);
    setShowModal(false);
    // handleNext?.();
  };

  // OTP modal (guest flow)
  const [showOtp, setShowOtp] = useState(false);

  const sendingOtp = phoneStatus === LOADING;
  const verifyingOtp = verifyStatus === LOADING;

  const handleGuestSubmit_StartOtp = async (e) => {
    e.preventDefault();
    const { fullName, phone, line1, city, state, pincode } = formData;
    if (![fullName, phone, line1, city, state, pincode].every(Boolean)) {
      showErrorToastWithIcon("Please fill all required address fields.");
      return;
    }

    // set this address as delivery address
    setDeliveryAddress({fullName, phone, line1, line2: formData.line2 || "", city, state, pincode})

    try {
      const res = await dispatch(sendOtpOnPhone(formData.phone)).unwrap();
      // success
      toast.success("OTP sent to your mobile");
      setShowOtp(true);
    } catch (err) {
      // err could be string or object
      const msg =
        typeof err === "object" && err !== null
          ? Object.values(err).join(", ")
          : err || "Failed to send OTP";
      showErrorToastWithIcon(msg);
    }
  };

  const handleVerifyOtpAndProceed = async (otpCode) => {
    try {
      let [firstName = '', ...rest] = formData.fullName.trim().split(/\s+/);
      let lastName = rest.join(' ');
      // verify and hydrate session (backend returns user or sets session)
      await dispatch(verifySmsOtp({
        phone: formData.phone,
        otp: otpCode,
        firstName,
        lastName,
      })).unwrap();

      setShowOtp(false);
      toast.success("Mobile verified");
      // api call to update user addresses
      handleNext?.(); // proceed to next step
    } catch (err) {
      const msg =
        typeof err === "object" && err !== null
          ? Object.values(err).join(", ")
          : err || "Failed to verify OTP";
      showErrorToastWithIcon(msg);
      throw err;
    }
  };

  // ===== UI =====
  return (
    <div className="py-6 md:p-10 flex justify-center">
      <div className="w-full max-w-3xl border border-hover-tint bg-light">
        {/* Header */}
        <div className="flex items-center gap-2 px-5 md:px-8 py-4 border-b border-hover-tint">
          <BackButton handleClick={handleBack} />
          <h2 className="text-xl uppercase font-gfs-didot text-dark">Delivery</h2>
        </div>

        <div className="px-5 md:px-8 py-6">
          {isLoggedIn ? (
            <>
              <SavedAddresses
                addresses={addresses}
                selectedId={selectedAddressId}
                onSelect={setSelectedAddressId}
                handleNewAddress={() => setShowModal(true)}
              />

              {selectedAddressId && (
                <div className="mt-8">
                  <button
                    onClick={() => handleNext?.()}
                    className="rounded-none w-full sm:w-fit bg-dark text-xs uppercase px-6 py-2 enabled:cursor-pointer hover:opacity-90 text-light"
                  >
                    Save and Continue
                  </button>
                </div>
              )}
            </>
          ) : (
            <AddressForm
              formData={formData}
              onChange={handleChange}
              onSubmit={handleGuestSubmit_StartOtp}
              isLoading={sendingOtp}
            />
          )}
        </div>

        {showModal && (
          <NewAddressModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            onSave={handleAddAddress}
            formData={formData}
            onChange={handleChange}
          />
        )}

        {/* OTP Verification Modal (guest only) */}
        {showOtp && (
          <OtpVerificationModal
            phone={formData.phone}
            loading={verifyingOtp}
            onClose={() => setShowOtp(false)}
            onConfirm={handleVerifyOtpAndProceed}
            onResend={() => dispatch(sendOtpOnPhone(formData.phone)).unwrap()}
            resendTimeoutSec={OTP_RESEND_TIMEOUT}
            otpLength={6}
          />
        )}
      </div>
    </div>
  );
}