import React, { useState } from 'react';
import { ShoppingCart, User, Menu, X, Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';
import Cart from '../cart/Cart';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(true);

  const closeCart = () => {
    setIsCartOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md py-3">
      <div className="flex items-center justify-between px-3 md:px-6 py-3 md:py-5 text-sm md:text-base">
        {/* Hamburger Icon */}
        <button
          className="mr-3 hover:cursor-pointer"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5 md:w-7 md:h-7 text-gray-800" />
        </button>

        {/* Logo */}
        <div className="text-2xl font-bold tracking-wide italic text-gray-900">
          <Link to="/">Tashn</Link>
        </div>

        {/* Header Icons */}
        <div className="flex items-center space-x-5 font-thin">
          <User className="w-5 h-5 md:w-6 md:h-6 cursor-pointer hover:text-black" />
          <ShoppingCart onClick={() => setIsCartOpen(true)} className="w-5 h-5 md:w-6 md:h-6 cursor-pointer hover:text-black" />
        </div>
      </div>

      {/* Slide-in Navigation */}
      <div
        className={`fixed flex flex-col top-0 left-0 h-full w-68 md:w-80 bg-[var(--dark-olive-green)] text-white shadow-lg transform transition-transform duration-500 z-50 ${menuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex items-center justify-between p-6">
          <button className='cursor-pointer' onClick={() => setMenuOpen(false)} aria-label="Close menu">
            <X className="w-6 h-6 font-thin" />
          </button>
        </div>

        <nav className="flex flex-col p-6 text-white text-base tracking-widest uppercase font-medium">
          <Link
            className="border-b-[1px] border-white/30 py-5"
            to="/"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>

          {/* Collapsible Shop Section */}
          <div className="border-b-[1px] border-white/30">
            <button
              className="flex justify-between items-center w-full py-5 uppercase font-medium tracking-widest hover:cursor-pointer"
              onClick={() => setShopOpen(!shopOpen)}
            >
              <span>Shop</span>
              {shopOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            </button>

            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out ${shopOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                }`}
            >
              <div className="ml-4 flex flex-col gap-6 text-sm tracking-[0.2rem] pb-6 text-white/80 pt-2">
                <Link to="/shop/oversized-tshirts" className="hover:text-white" onClick={() => setMenuOpen(false)}>
                  Oversized T-shirts
                </Link>
                <Link to="/shop/trendy-polos" className="hover:text-white" onClick={() => setMenuOpen(false)}>
                  Trendy Polos
                </Link>
              </div>
            </div>
          </div>

          <Link
            className="border-b-[1px] border-white/30 py-5"
            to="/about"
            onClick={() => setMenuOpen(false)}
          >
            About Us
          </Link>

          <Link
            className="border-b-[1px] border-white/30 py-5"
            to="/contact"
            onClick={() => setMenuOpen(false)}
          >
            Track your order
          </Link>
        </nav>

        {/* social links  */}
        <ul className="flex pt-4 pb-1 gap-x-4 mt-auto text-gray-200 justify-center mb-4 border-t border-white/30">
          <li>
            <Link target="_blank" to="https://instagram.com/tashn.in" className='hover:text-white text-[10px] tracking-wide uppercase font-roboto font-thin px-2'>
              Instagram
            </Link>
          </li>
          <li>
            <Link target="_blank" to="https://facebook.com/tashn.co.in" className='hover:text-white text-[10px] tracking-wide uppercase font-roboto font-thin px-2'>
            Facebook
            </Link>
          </li>
          <li>
            <Link target="_blank" to="https://instagram.com/tashn.in" className='hover:text-white text-[10px] tracking-wide uppercase font-roboto font-thin px-2'>
            X
            </Link>
          </li>
        </ul>
      </div>

      {/* Backdrop */}
      {(menuOpen || isCartOpen) && (
        <div
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 bg-black/20 bg-opacity-40 z-40"
        />
      )}

      <Cart isOpen={isCartOpen} closeCart={closeCart}/>
    </header>
  );
}