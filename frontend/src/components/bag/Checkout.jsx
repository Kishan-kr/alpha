import React from 'react';
import CheckoutProductCard from "./CheckoutProductCard";
import { Lock } from 'lucide-react';
import BackButton from './BackButton';

// dummy data of products 
const products = [
  {
    id: 1,
    title: 'Sony PlayStation 5 Pro',
    category: 'Game console',
    originalPrice: 499.99,
    thumbnail: 'https://picsum.photos/seed/prod1-1/500/800',
    color: 'Gray',
    qty: 2
  },
  {
    id: 2,
    title: 'Sony PlayStation Pulse 3D Wireless Headset',
    category: 'Standard Edition',
    originalPrice: 99.99,
    thumbnail: 'https://picsum.photos/seed/prod1-2/500/800',
    color: 'White',
    qty: 1
  },
];

const Checkout = ({ products, subtotal, total, delivery, discount, updateProducts, handleBack }) => {
  // const subtotal = products.reduce((sum, p) => sum + p.price, 0);
  // const tax = 10.0;
  // const total = subtotal + tax;

  const handleRemove = (id) => {
    updateProducts(products.filter(product => product.id !== id));
  };

  return (
    <div className="p-4 md:p-10 gap-8 text-dark grid grid-cols-1 lg:grid-cols-2">
      {/* Left: Order Summary */}
      <div>
        <div className='flex gap-x-2'>
          <BackButton handleClick={handleBack} className='-mt-1' />
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
        </div>

        <div className="flex flex-col gap-4">
          {products.map(product => (
            <CheckoutProductCard
              key={product.id}
              product={product}
              onRemove={() => handleRemove(product.id)}
            />
          ))}
        </div>
        <div className="mt-4 p-4 bg-muted border border-border rounded-xl">
          <div className="flex justify-between text-subtext mb-1">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-subtext mb-1">
            <span>Shipping</span>
            <span className="text-green-400">Free</span>
          </div>
          <div className="flex justify-between text-subtext mb-1">
            <span>Discount</span>
            <span>₹{discount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-dark font-semibold text-lg mt-2">
            <span>Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Right: Payment Form */}
      <div className="bg-muted border border-border rounded-xl p-6">
        <h2 className="text-xl font-bold mb-6">Payment Details</h2>
        <form className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email address"
            className="bg-surface border border-border rounded px-4 py-2 text-dark"
          />
          <input
            type="text"
            placeholder="Card number"
            className="bg-surface border border-border rounded px-4 py-2 text-dark"
          />
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="MM/YY"
              className="flex-1 bg-surface border border-border rounded px-4 py-2 text-dark"
            />
            <input
              type="text"
              placeholder="CVV"
              className="flex-1 bg-surface border border-border rounded px-4 py-2 text-dark"
            />
          </div>
          <input
            type="text"
            placeholder="Cardholder name"
            className="bg-surface border border-border rounded px-4 py-2 text-dark"
          />
          <input
            type="text"
            placeholder="Street address"
            className="bg-surface border border-border rounded px-4 py-2 text-dark"
          />
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="City"
              className="flex-1 bg-surface border border-border rounded px-4 py-2 text-dark"
            />
            <input
              type="text"
              placeholder="ZIP Code"
              className="flex-1 bg-surface border border-border rounded px-4 py-2 text-dark"
            />
          </div>
          <button
            type="submit"
            className="bg-dark text-light font-semibold py-2 rounded hover:bg-subtext hover:text-dark transition flex items-center justify-center gap-2 mt-4"
          >
            <Lock size={16} /> Pay ₹{total.toFixed(2)}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;