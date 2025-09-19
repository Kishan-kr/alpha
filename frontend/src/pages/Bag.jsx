import React, { useEffect, useState } from 'react';
import ShoppingBag from '../components/bag/ShoppingBag';
import Checkout from '../components/bag/Checkout';
import DeliverySection from '../components/bag/DeliverySection';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserBagThunk } from '../store/actions/bagAction';
import { clearBag } from '../store/slices/bagSlice';


const Bag = () => {
  const { items: products } = useSelector(state => state.bag);
  const { isLoggedIn } = useSelector(state => state.user);
  const steps = ["Shopping Bag", "Delivery", "Payment"];
  const [activeStep, setActiveStep] = useState(0)
  const [deliveryAddress, setDeliveryAddress] = useState({});
  const dispatch = useDispatch();

  // effect to fetch bag items from DB if logged in 
  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchUserBagThunk())
    }
  }, [dispatch])

  const subtotal = products?.reduce((sum, product) => sum + product.effectivePrice * product.quantity, 0);
  const originalTotal = products?.reduce((sum, product) => sum + product.originalPrice * product.quantity, 0);
  const discount = originalTotal - subtotal;
  const deliveryFee = 0; // need to make it dynamic
  const total = subtotal + deliveryFee;
  // calculate discount percentage 
  const discountPercent =
    originalTotal > 0 ? ((discount / originalTotal) * 100).toFixed(2) : 0;

  const nextStep = () => {
    if (activeStep < 2) {
      setActiveStep(activeStep + 1)
    }
  }

  const prevStep = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1)
    }
  }

  // method to handle successful order placement 
  const onOrderSuccess = async (orderNumber, token) => {
    dispatch(clearBag());
    window.location.href = `/order-success?ordn=${orderNumber}&token=${token}`;
  }

  return (
    <div className="bg-light px-6 py-20 md:px-24 md:py-24">
      {/* Stepper */}
      <div className="w-full flex justify-center mt-4">
        <div className="flex gap-2 items-center text-xs font-light">
          {steps.map((label, index) => (
            <div key={index} className="flex items-center gap-1 xxs:gap-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs
          ${index === activeStep ? "bg-dark text-light" : "bg-light text-dark"}`}>
                {index + 1}
              </div>
              {/* step label  */}
              <span className={`uppercase ${index === activeStep ? "text-dark" : "text-subtext"}`}>{label}</span>
              {/* line after step  */}
              {index < steps.length - 1 && <div className="w-5 xxs:w-6 h-px bg-dark/10" />}
            </div>
          ))}
        </div>
      </div>

      {/* title  */}
      {activeStep === 0 && <div className='flex gap-2 mt-12 mb-3 md:mb-11'>
        <h2 className="text-xl uppercase font-gfs-didot text-dark">{steps[activeStep]}</h2>
        {activeStep === 0 && <small className='p-px px-1 mt-1 bg-surface text-xxs h-fit text-subtext'>{products?.length} {products?.length > 1 ? "items" : "item"}</small>}
      </div>}

      {/* return ShoppingBag or Address or Payment component based on active state  */}
      {activeStep === 0 &&
        <ShoppingBag
          products={products}
          subtotal={subtotal}
          discount={discount}
          discountPercent={discountPercent}
          delivery={deliveryFee}
          total={total}
          handleCheckout={nextStep}
        />}
      {activeStep === 1 &&
        <DeliverySection
          handleNext={nextStep}
          handleBack={prevStep}
          setDeliveryAddress={setDeliveryAddress}
        />}
      {activeStep === 2 &&
        <Checkout
          products={products}
          subtotal={subtotal}
          discount={discount}
          delivery={deliveryFee}
          deliveryAddress={deliveryAddress}
          total={total}
          onOrderSuccess={onOrderSuccess}
          handleBack={prevStep}
        />}
    </div>
  );
};

export default Bag;