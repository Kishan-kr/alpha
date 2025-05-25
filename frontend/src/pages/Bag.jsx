import React, { useState } from 'react';
import ShoppingBag from '../components/bag/ShoppingBag';
import Checkout from '../components/bag/Checkout';
import DeliverySection from '../components/bag/DeliverySection';

// dummy data
const initialProducts = [
  {
    id: 1,
    title: 'Raktcharit black oversized T-shirt',
    size: 'S',
    color: 'White',
    originalPrice: 145,
    quantity: 2,
    selectedSize: 'S',
    category: 'Oversized T-shirt',
    availableSizes: ['S', 'M', 'L', 'XL'],
    thumbnail: 'https://picsum.photos/seed/prod1-1/500/800'
  },
  {
    id: 2,
    title: 'Laughing Gas',
    size: 'M',
    color: 'Red',
    originalPrice: 180,
    quantity: 4,
    category: 'Oversized T-shirt',
    selectedSize: 'L',
    availableSizes: ['M', 'L', 'XL'],
    thumbnail: 'https://picsum.photos/seed/prod1-2/500/800'
  },
  {
    id: 3,
    title: 'Ammonium Gas',
    size: 'L',
    color: 'Blue',
    originalPrice: 240,
    quantity: 8,
    category: 'Oversized Polo',
    selectedSize: 'XL',
    availableSizes: ['S', 'M', 'L'],
    thumbnail: 'https://picsum.photos/seed/prod1-3/500/800'
  },
];

const Bag = () => {
  const [products, setProducts] = useState(initialProducts);
  const steps = ["Bag", "Delivery", "Payment"];
  const [activeStep, setActiveStep] = useState(0)

  const subtotal = products.reduce((sum, product) => sum + product.originalPrice * product.quantity, 0);
  const discount = subtotal * 0.2;
  const delivery = 15;
  const total = subtotal - discount + delivery;

  const updateProducts = (newProducts) => {
    setProducts(newProducts)
  }

  const nextStep = () => {
    if(activeStep < 2) {
      setActiveStep(activeStep + 1)
    }
  }

  const prevStep = () => {
    if(activeStep > 0) {
      setActiveStep(activeStep - 1)
    }
  }

  return (
    <div className=" bg-dark bg-gradient-to-bl from-surface to-dark/60 py-20 md:px-8 md:py-24">
      {/* Stepper */}
      <div className="w-full flex justify-center">
        <div className="flex gap-2 items-center">
          {steps.map((label, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
          ${index === activeStep ? "bg-dark text-light" : "bg-accent text-subtext"}`}>
                {index + 1}
              </div>
              {/* step label  */}
              <span className={`text-sm ${index === activeStep ? "text-light" : "text-subtext"}`}>{label}</span>
              {/* line after step  */}
              {index < steps.length - 1 && <div className="w-5 xs:w-8 h-0.5 bg-border" />}
            </div>
          ))}
        </div>
      </div>

      {/* return ShoppingBag or Address or Payment component based on active state  */}
      {activeStep === 0 && 
        <ShoppingBag 
          products={products} 
          subtotal={subtotal}
          discount={discount}
          delivery={delivery}
          total={total}
          updateProducts={updateProducts}
          handleCheckout={nextStep}
        />}
      {activeStep === 1 && <DeliverySection handleNext={nextStep}/>}
      {activeStep === 2 && 
        <Checkout 
          products={products} 
          subtotal={subtotal}
          discount={discount}
          delivery={delivery}
          total={total} 
          updateProducts={updateProducts}
        />}
    </div>
  );
};

export default Bag;