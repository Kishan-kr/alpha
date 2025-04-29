import React, { useState } from 'react';
import { ShoppingCart, User, Menu, X, Instagram, Facebook, Plus, Minus, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);

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
          <ShoppingCart className="w-5 h-5 md:w-6 md:h-6 cursor-pointer hover:text-black" />
          <User className="w-5 h-5 md:w-6 md:h-6 cursor-pointer hover:text-black" />
        </div>
      </div>

      {/* Slide-in Navigation */}
      <div
        className={`fixed flex flex-col top-0 left-0 h-full w-68 md:w-80 bg-[var(--color-black)] text-white shadow-lg transform transition-transform duration-300 z-50 ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
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
            {shopOpen && (
              <div className="ml-4 flex flex-col gap-6 text-sm tracking-[0.2rem] pb-6 text-white/60">
                <Link to="/shop/oversized-tshirts" onClick={() => setMenuOpen(false)}>Oversized T-shirts</Link>
                <Link to="/shop/trendy-polos" onClick={() => setMenuOpen(false)}>Trendy Polos</Link>
              </div>
            )}
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

        <ul className="flex pt-4 pb-1 gap-x-6 mt-auto text-gray-300 justify-center mb-4 border-t border-white/30">
          <li>
            <Link target="_blank" to="https://instagram.com/tashn.in">
              <Instagram className='w-5 h-5 md:w-6 md:h-6'/>
            </Link>
          </li>
          <li>
            <Link target="_blank" to="https://facebook.com/tashn.co.in">
              <Facebook className='w-5 h-5 md:w-6 md:h-6'/>
            </Link>
          </li>
          <li>
            <Link target="_blank" to="https://instagram.com/tashn.in">
              <Twitter className='w-5 h-5 md:w-6 md:h-6'/>
            </Link>
          </li>
        </ul>
      </div>

      {/* Backdrop */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 bg-black/20 bg-opacity-40 z-40"
        />
      )}
    </header>
  );
}