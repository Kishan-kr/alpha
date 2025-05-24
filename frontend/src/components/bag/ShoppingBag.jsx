import React from 'react';
import BagProductCard from './BagProductCard';
import { ArrowRight } from 'lucide-react';
import EmptyBag from './EmptyBag';

const ShoppingBag = ({ products, subtotal, discount, delivery, total, updateProducts, handleCheckout }) => {

  const handleIncrease = (id) => {
    updateProducts(products.map(product => product.id === id ? { ...product, quantity: product.quantity + 1 } : product));
  };
  
  const handleDecrease = (id) => {
    updateProducts(products.map(product => product.id === id && product.quantity > 1 ? { ...product, quantity: product.quantity - 1 } : product));
  };
  
  const handleDelete = (id) => {
    updateProducts(products.filter(product => product.id !== id));
  };

  const handleSizeChange = (id, selectedSize) => {
    updateProducts(products.map(product => product.id === id ? { ...product, selectedSize } : product));
  };

  return (
    <div className='p-4 md:p-10 flex flex-col slg:flex-row gap-8'>
      {/* main bag layout  */}
      <section className='flex-1 sm:p-1 rounded-xl sm:border border-border'>
        <div className=" bg-dark rounded-lg p-4 space-y-4 border border-border">
          <div className='flex gap-2'>
            <h2 className="text-xl font-semibold text-light mb-4">Your Bag</h2>
            <small className='p-px px-1 mt-1 bg-surface rounded text-[10px] h-fit text-subtext'>{products.length} {products.length > 1 ? "items" : "item"}</small>
          </div>
          {products.length ? products.map(product => (
            <BagProductCard
              key={product.id}
              product={product}
              onIncrease={handleIncrease}
              onDecrease={handleDecrease}
              onRemove={handleDelete}
              onSizeChange={handleSizeChange}
            />
          )) : <EmptyBag />}
        </div>
      </section>
      {/* right checkout section  */}
      {products.length > 0 && <section className="w-full h-fit slg:w-1/3 sm:p-1 rounded-xl sm:border border-border text-light shadow-2xl shadow-dark slg:sticky slg:top-24">
        <div className='bg-dark p-6 rounded-lg border border-border'>
          <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
          <div className="flex justify-between items-center mb-3">
            <span>Subtotal</span>
            <span>${subtotal}</span>
          </div>
          <div className="flex justify-between items-center mb-3 text-red-500">
            <span>Discount (20%)</span>
            <span>-${discount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center mb-3">
            <span>Delivery Fee</span>
            <span>${delivery}</span>
          </div>
          <div className="flex justify-between items-center font-bold text-lg mt-4">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <button onClick={handleCheckout} className="mt-6 w-full inline-flex group justify-center items-center px-6 py-3 bg-light text-dark font-semibold rounded-full shadow-md cursor-pointer">
            Checkout
            <ArrowRight className="ml-2 w-5 h-5 text-white bg-dark rounded-full p-1 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </section>}
    </div>
  );
};

export default ShoppingBag;