import React, { useState } from 'react';
import { ShoppingBag, User, Search, Menu } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux'
import navItems from '../../utils/navItems';
import MobileMenu from './MobileMenu';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  // get user state from redux slice 
  const {isLoggedIn} = useSelector(state => state.user)

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
              <NavLink
                to={path}
                className= {({isActive}) => `px-4 py-2 rounded-full text-base font-medium transition-all duration-200 ${isActive ? 'bg-light text-dark' : 'hover:bg-white/10'
                  }`}
              >
                {name}
              </NavLink>
              {children && (
                <div className="absolute left-0 top-full hidden group-hover:block bg-transparent rounded-md">
                  <ul className='mt-2 p-1 bg-surface rounded-2xl shadow-md'>
                    {children.map((child) => (
                      <li key={child.name}>
                        <NavLink
                          to={child.path}
                          className={({isActive}) => `block px-4 py-1 text-sm rounded-full hover:text-light hover:bg-white/10 whitespace-nowrap ${isActive ? 'bg-white/10 text-white': 'text-subtext'}`}
                        >
                          {child.name}
                        </NavLink>
                      </li>
                    ))}

                  </ul>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Right: Icons */}
        <div className="flex items-center gap-x-6">
          <button
            type="button"
            className="cursor-pointer hover:text-white p-1"
          >
            <Search className="w-5 h-5" />
          </button>

          <Link
            to={isLoggedIn ? '/profile' : '/signup'}
            className="hidden md:block cursor-pointer hover:text-white p-1"
          >
            <User className="w-5 h-5" />
          </Link>

          <Link
            to="/bag"
            className="cursor-pointer hover:text-white p-1"
          >
            <ShoppingBag className="w-5 h-5" />
          </Link>


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
      <MobileMenu 
        navItems={navItems} 
        menuOpen={menuOpen} 
        setMenuOpen={setMenuOpen} 
      />

    </header >
  );
}