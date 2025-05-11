import React, { useState } from 'react';
import { ShoppingBag, User, Search, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import navItems from '../../utils/navItems';

export default function Navbar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-dark text-light shadow-sm">
      <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        {/* Left: Logo */}
        <Link to="/" className="text-xl font-extrabold tracking-wider uppercase">
          TASHN
        </Link>

        {/* Center: Nav Links (Desktop) */}
        <nav className="hidden md:flex items-center bg-surface p-1 rounded-full space-x-4">
          {navItems.map(({ name, path, children }) => (
            <div key={name} className="relative group">
              <Link
                to={path}
                className={`px-4 py-1 rounded-full text-sm font-medium transition-all duration-200 ${currentPath === path ? 'bg-light text-dark' : 'hover:bg-white/10'
                  }`}
              >
                {name}
              </Link>
              {children && (
                <div className="absolute left-0 top-full hidden group-hover:block bg-transparent rounded-md">
                  <ul className='mt-2 p-1 bg-surface rounded-2xl shadow-md'>
                    {children.map((child) => (
                      <li key={child.name}>
                        <Link
                          to={child.path}
                          className="block px-4 py-1 text-sm rounded-full text-subtext hover:bg-hoverTint hover:text-light hover:bg-white/10 whitespace-nowrap"
                        >
                          {child.name}
                        </Link>
                      </li>
                    ))}

                  </ul>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Right: Icons */}
        <div className="flex items-center space-x-6">
          <Search className="w-5 h-5 cursor-pointer hover:text-white" />
          <User className="w-5 h-5 cursor-pointer hover:text-white hidden md:block" />
          <ShoppingBag className="w-5 h-5 cursor-pointer hover:text-white" />

          {/* Hamburger (Mobile Only) */}
          <button
            className="md:hidden text-light focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Menu />
          </button>
        </div>
      </div >

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-screen w-3/4 max-w-sm bg-surface z-40 transform transition-transform duration-300 ease-in-out md:hidden ${menuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <div className="flex items-center justify-between p-6">
          <button className='cursor-pointer ms-auto' onClick={() => setMenuOpen(false)} aria-label="Close menu">
            <X className="w-6 h-6 font-thin" />
          </button>
        </div>

        <div className="p-4 py-6">
          <ul className="flex flex-col space-y-2">
            {navItems.map(({ name, path, children }) => (
              <li key={name}>
                <Link
                  to={path}
                  onClick={() => setMenuOpen(false)}
                  className={`block py-2 px-4 rounded text-sm ${currentPath === path ? 'bg-light text-dark' : 'text-light'
                    }`}
                >
                  {name}
                </Link>
                {children && (
                  <ul className="ml-4 mt-1 space-y-1">
                    {children.map((child) => (
                      <li key={child.name}>
                        <Link
                          to={child.path}
                          onClick={() => setMenuOpen(false)}
                          className="block py-1 px-4 text-subtext hover:text-light"
                        >
                          {child.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* social links  */}
        <ul className="flex gap-x-4 mt-auto py-4 text-gray-200 justify-center border border-border">
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

      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/20 bg-opacity-40 z-40 md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

    </header >
  );
}

