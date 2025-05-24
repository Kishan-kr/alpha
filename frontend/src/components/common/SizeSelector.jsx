import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const SizeSelectMenu = ({ sizes, selectedSize, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  // Close menu on outside click
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
    <div className="relative w-full max-w-xs" ref={wrapperRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-fit flex items-center justify-between px-1 py-1 rounded-md bg-surface border-border text-light/70 hover:border-light hover:text-light transition enabled:cursor-pointer"
      >
        <span className='ps-1'>{selectedSize || 'Select Size'}</span>
        <ChevronDown size={18} className={`ms-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-fit bg-dark border border-border rounded-md shadow-lg p-2 flex flex-col sm:flex-row gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => {
                onChange(size);
                setIsOpen(false);
              }}
              className={`px-4 py-2 text-sm rounded-md border enabled:cursor-pointer transition 
                ${
                  selectedSize === size
                    ? 'bg-light text-dark border-light'
                    : 'bg-surface text-subtext border-border hover:border-light hover:text-light'
                }`}
            >
              {size}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SizeSelectMenu;