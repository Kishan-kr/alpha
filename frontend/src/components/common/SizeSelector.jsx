import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';


const SizeSelectMenu = ({ sizes, selectedSize, onChange, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  // Close menu when clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-fit" ref={wrapperRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {children ? children : (
          <button className="w-fit flex items-center justify-between px-1 py-1 bg-surface border-border text-dark/70 hover:border-light hover:text-dark transition">
            <span className="ps-1">{selectedSize || 'Select Size'}</span>
            <ChevronDown size={18} className={`ms-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 -top-1 translate-y-[-100%] origin-bottom right-0 w-fit bg-light shadow-md p-1 flex flex-col sm:flex-row gap-1 overflow-hidden"
          >
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => {
                  onChange(size);
                  setIsOpen(false);
                }}
                className={`px-4 py-2 text-sm transition enabled:cursor-pointer 
                ${selectedSize === size
                    ? 'bg-dark text-light'
                    : 'bg-surface text-dark'
                  }`}
              >
                {size}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SizeSelectMenu;