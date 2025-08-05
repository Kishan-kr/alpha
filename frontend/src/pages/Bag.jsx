import React, { useState } from 'react';
import ShoppingBag from '../components/bag/ShoppingBag';
import Checkout from '../components/bag/Checkout';
import DeliverySection from '../components/bag/DeliverySection';
import CartPage from './Cart';
import { useSelector } from 'react-redux';

// dummy data
const initialProducts = [
  {
    id: 1,
    title: 'dark black filled with dragon oversized T-shirt',
    size: 'S',
    color: 'White',
    originalPrice: 145,
    quantity: 2,
    selectedSize: 'S',
    category: 'Oversized T-shirt',
    availableSizes: ['S', 'M', 'L', 'XL'],
    thumbnail: 'https://picsum.photos/seed/prod7-1/900/1200'
  },
  {
    id: 2,
    title: 'Make sure you"re using the Tailwind',
    // title: 'Green Oversized T-shirt',
    size: 'M',
    color: 'Red',
    originalPrice: 180,
    quantity: 4,
    category: 'Oversized T-shirt',
    selectedSize: 'L',
    availableSizes: ['M', 'L', 'XL'],
    thumbnail: 'https://picsum.photos/seed/prod1-2/900/1200'
  },
  {
    id: 3,
    title: 'Elanore Oversized T-shirt',
    size: 'L',
    color: 'Blue',
    originalPrice: 240,
    quantity: 8,
    category: 'Oversized Polo',
    selectedSize: 'XL',
    availableSizes: ['S', 'M', 'L'],
    thumbnail: 'https://picsum.photos/seed/prod1-3/900/1200'
  },
];

const Bag = () => {
  // const [products, setProducts] = useState(initialProducts);
  const { items: products } = useSelector(state => state.bag);
  const steps = ["Shopping Bag", "Delivery", "Payment"];
  const [activeStep, setActiveStep] = useState(0)

  const subtotal = products.reduce((sum, product) => sum + product.effectivePrice * product.quantity, 0);
  const discountedPrice = products.reduce((sum, product) => sum + product.originalPrice * product.quantity, 0);
  const discount = subtotal - discountedPrice;
  const delivery = 75;
  const total = subtotal - discount + delivery;

  // const updateProducts = (newProducts) => {
  //   setProducts(newProducts)
  // }

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
      <div className='flex gap-2 mt-12 mb-3 md:mb-11'>
        <h2 className="text-xl uppercase font-gfs-didot text-dark">{steps[activeStep]}</h2>
        {activeStep === 0 && <small className='p-px px-1 mt-1 bg-surface text-xxs h-fit text-subtext'>{products.length} {products.length > 1 ? "items" : "item"}</small>}
      </div>

      {/* return ShoppingBag or Address or Payment component based on active state  */}
      {activeStep === 0 &&
        <ShoppingBag
          products={products}
          subtotal={subtotal}
          discount={discount}
          delivery={delivery}
          total={total}
          // updateProducts={updateProducts}
          handleCheckout={nextStep}
        />}
      {activeStep === 1 &&
        <DeliverySection
          handleNext={nextStep}
          handleBack={prevStep}
        />}
      {activeStep === 2 &&
        <Checkout
          products={products}
          subtotal={subtotal}
          discount={discount}
          delivery={delivery}
          total={total}
          updateProducts={updateProducts}
          handleBack={prevStep}
        />}
    </div>
  );
};

export default Bag;