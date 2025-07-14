import React, { useEffect, useState } from 'react';
import { ShoppingBag, User, Search, Menu } from 'lucide-react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux'
import navItems from '../../utils/navItems';
import MobileMenu from './MobileMenu';
import SearchBar from './SearchBar';
import { VALID_CATEGORIES } from '../../constants/categories';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false); //new
  const location = useLocation();

  // get user state from redux slice 
  const { isLoggedIn } = useSelector(state => state.user)
  const isHome = location.pathname === '/';

  useEffect(() => {
    if (!isHome) {
      setIsScrolled(true); // Force background on other pages
      return;
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHome]);

  const firstCollectionPath = `/collections/${VALID_CATEGORIES[0].slug}`

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-colors duration-500 ${isScrolled ? 'text-dark bg-light' : 'bg-transparent text-light'}`}>
      <div className="flex items-center justify-between px-5 md:px-15 py-6 max-w-7xl mx-auto">
        {/* Left: Logo */}
        <Link to="/" className="text-xl tracking-wider font-montserrat uppercase">
          TASHN
        </Link>

        {/* Center: Nav Links (Desktop) */}
        <nav className="hidden md:flex items-center bg-surface py-1 px-1 rounded-full space-x-1 slg:space-x-3">
          {navItems.map(({ name, path, children }) => (
            <div key={name} className="relative group">
              <NavLink
                to={path === '/collections' ? firstCollectionPath : path } // to navigate to first collection if path is '/collections'
                className={({ isActive }) => `px-2 slg:px-4 py-1 rounded-full text-sm slg:text-base transition-all duration-200 ${isActive ? 'bg-light text-dark' : 'text-subtext hover:text-dark'
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
                          className={({ isActive }) => `block px-4 py-1 text-sm rounded-full whitespace-nowrap ${isActive ? 'bg-light text-dark' : 'text-subtext hover:text-dark'}`}
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
            onClick={() => setSearchOpen(!searchOpen)}
            className="cursor-pointer p-1"
          >
            <Search className="w-5 h-5" strokeWidth={1} />
          </button>

          <Link
            to={isLoggedIn ? '/profile' : '/signup'}
            className="hidden md:block cursor-pointer p-1"
          >
            <User className="w-5 h-5" strokeWidth={1} />
          </Link>

          <Link
            to="/bag"
            className="cursor-pointer p-1"
          >
            <ShoppingBag className="w-5 h-5" strokeWidth={1} />
          </Link>


          {/* Hamburger (Mobile Only) */}
          <button
            className="md:hidden focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Menu strokeWidth={1} />
          </button>
        </div>
      </div >

      {/* Mobile Menu */}
      <MobileMenu
        navItems={navItems}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
      />

      {searchOpen &&
        <SearchBar setSearchOpen={setSearchOpen} />
      }
    </header >
  );
}