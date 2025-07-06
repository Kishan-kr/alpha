import { NavLink } from "react-router-dom";
import { X, ChevronDown } from "lucide-react";
import React, { useState } from "react";

export default function MobileMenu({ navItems, menuOpen, setMenuOpen }) {
  const [openSections, setOpenSections] = useState({});

  const toggleSection = (name) =>
    setOpenSections((s) => ({ ...s, [name]: !s[name] }));

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMenuOpen(false)}
      />

      {/* Full-Width Drawer */}
      <aside
        className={`
          fixed top-0 right-0 h-full w-full bg-light
          shadow-xl z-50 transform transition-transform duration-300 ease-in-out
          ${menuOpen ? "translate-x-0" : "translate-x-full"}
          flex flex-col
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4">
          <NavLink to="/" onClick={() => setMenuOpen(false)} className="text-xl text-dark font-montserrat tracking-wider uppercase">
            TASHN
          </NavLink>
          <button
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            className="p-2 text-subtext hover:text-light transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-5">
          <ul className="space-y-1">
            {navItems.map(({ name, path, Icon, children }) => {
              const isOpen = openSections[name];
              return (
                <li key={name} className=" uppercase rounded-md overflow-hidden">
                  <div className="flex items-center justify-between">
                    <NavLink
                      to={path}
                      end={children ? false : true}
                      onClick={() => setMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center py-2 transition-colors ${
                          isActive ? "text-dark" : "text-subtext"
                        }`
                      }
                    >
                      <Icon className="w-5 h-5 mr-4" />
                      {name}
                    </NavLink>

                    {/* toggle button  */}
                    {children && (
                      <button
                        onClick={() => toggleSection(name)}
                        className="p-2 text-subtext hover:text-dark transition"
                      >
                        <ChevronDown
                          className={`w-5 h-5 transform transition-transform ${
                            isOpen ? "-rotate-180" : ""
                          }`}
                        />
                      </button>
                    )}
                  </div>

                  {/* submenu  */}
                  {children && (
                    <div
                      className={`
                        transition-max-height duration-400 ease-in
                        overflow-hidden
                        ${isOpen ? "max-h-60" : "max-h-0"}
                      `}
                    >
                      <ul className="mt-1">
                        {children.map((child) => (
                          <li key={child.name}>
                            <NavLink
                              to={child.path}
                              end
                              onClick={() => setMenuOpen(false)}
                              className={({ isActive }) =>
                                `block py-2 pl-12 pr-6 text-base transition-colors ${
                                  isActive ? "text-dark" : "text-subtext hover:text-dark"
                                }`
                              }
                            >
                              {child.name}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Social Links */}
        <div className="px-6 py-6 mb-2 border-t border-border">
          <ul className="flex justify-center gap-6">
            <li>
              <a
                href="https://instagram.com/tashn.in"
                target="_blank"
                rel="noreferrer"
                className="text-subtext hover:text-dark uppercase text-xs tracking-wide transition"
              >
                Instagram
              </a>
            </li>
            <li>
              <a
                href="https://facebook.com/tashn.co.in"
                target="_blank"
                rel="noreferrer"
                className="text-subtext hover:text-dark uppercase text-xs tracking-wide transition"
              >
                Facebook
              </a>
            </li>
            <li>
              <a
                href="https://twitter.com/tashn.in"
                target="_blank"
                rel="noreferrer"
                className="text-subtext hover:text-dark uppercase text-xs tracking-wide transition"
              >
                X
              </a>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
}