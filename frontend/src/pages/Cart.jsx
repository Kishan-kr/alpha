// src/pages/Bag.jsx (refactored layout)
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Trash2 } from 'lucide-react';

const CartPage = ({ products, handleCheckout, updateQuantity }) => {
  const subtotal = products.reduce((acc, p) => acc + p.originalPrice * p.quantity, 0);
  const discount = subtotal * 0.2;
  const delivery = 15;
  const total = subtotal - discount + delivery;

  return (
    <div className="min-h-screen bg-light pt-28 px-4 md:px-16">
      <h1 className="text-2xl font-semibold text-dark mb-8">Shopping Cart</h1>

      {products.length === 0 ? (
        <div className="text-center text-subtext">
          <p className="text-lg">Your bag is empty.</p>
          <Link to="/" className="inline-block mt-6 px-6 py-2 bg-dark text-light rounded-full hover:bg-dark/80">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left - Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {products.map((item) => (
              <div key={item.id} className="flex gap-4 items-center border-b border-border pb-4">
                <img src={item.thumbnail} alt={item.title} className="w-24 h-32 object-cover rounded" />
                <div className="flex-1">
                  <h2 className="font-medium text-dark">{item.title}</h2>
                  <p className="text-subtext text-sm">{item.category} • {item.color}</p>
                  <div className="flex items-center mt-2 gap-4">
                    <span className="text-dark text-sm">Size: {item.selectedSize}</span>
                    <span className="text-dark text-sm">Qty: {item.quantity}</span>
                    <span className="text-dark text-sm">₹{item.originalPrice}</span>
                  </div>
                </div>
                <button  className="text-red-500 hover:text-red-400">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          {/* Right - Summary */}
          <div className="bg-surface p-6 rounded-lg border border-border text-dark space-y-4 h-fit">
            <h3 className="text-xl font-semibold mb-4">Summary</h3>
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-red-500">
              <span>Discount</span>
              <span>-₹{discount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Delivery</span>
              <span>₹{delivery}</span>
            </div>
            <div className="flex justify-between text-base font-bold pt-4 border-t border-border">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full bg-dark text-light py-2 rounded-full mt-4 flex items-center justify-center gap-2 hover:bg-dark/90"
            >
              Proceed to Checkout <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;