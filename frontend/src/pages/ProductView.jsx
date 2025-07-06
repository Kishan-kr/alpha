// src/pages/ProductView.jsx
import React, { useEffect, useRef, useState } from 'react';


// Data-URI cursors with shorter body & stubby head
const CURSOR_LEFT = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='none' stroke='%23ffffff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cline x1='18' y1='12' x2='10' y2='12'/%3E%3Cpolyline points='10 8 6 12 10 16'/%3E%3C/svg%3E") 12 12, auto`;
const CURSOR_RIGHT = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='none' stroke='%23ffffff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cline x1='6' y1='12' x2='14' y2='12'/%3E%3Cpolyline points='14 8 18 12 14 16'/%3E%3C/svg%3E") 12 12, auto`;


// src/data/dummyProduct.js
const product = {
  id: 'prod-001',
  title: 'Black Oversized Tee',
  description: `An ultra-comfortable black tee with an oversized fit. 
Crafted from 100% organic cotton for breathability and durability. 
Perfect for streetwear or lounge days — layer it up or wear it solo.`,
  images: [
    "https://picsum.photos/seed/prod1-1/800/800",
    "https://picsum.photos/seed/prod1-2/800/800",
    "https://picsum.photos/seed/prod1-3/800/800",
    "https://picsum.photos/seed/prod1-4/800/800"
  ],
  sizes: ["S", "M", "L", "XL", "XXL"]
};

export default function ProductView() {
  const { title, description, images, sizes } = product;
  const [currentImage, setCurrentImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(sizes[0]);

  const prevTimer = useRef(null);
  const nextTimer = useRef(null);

  const prevImage = () => {
    setCurrentImage((i) => (i - 1 + images.length) % images.length);
  }
  const nextImage = () => {
    setCurrentImage((i) => (i + 1) % images.length);
  }

  const handlePrevEnter = () => {
    // start cycling backward every 1s
    prevImage()
    prevTimer.current = setInterval(prevImage, 1000);
  };
  const handlePrevLeave = () => {
    clearInterval(prevTimer.current);
  };

  const handleNextEnter = () => {
    // start cycling forward every 1s
    nextImage()
    nextTimer.current = setInterval(nextImage, 1000);
  };
  const handleNextLeave = () => {
    clearInterval(nextTimer.current);
  };

  // cleanup on unmount
  useEffect(() => {
    return () => {
      clearInterval(prevTimer.current);
      clearInterval(nextTimer.current);
    };
  }, []);

  return (
    <div className="container mx-auto px-4 py-20 md:px-8 md:py-24 md:pt-36">
      {/* ─────── DESKTOP LAYOUT ─────── */}
      <div className="hidden md:flex md:space-x-12 md:justify-between items-center">
        {/* Left: Title & Description */}
        <div className="md:w-1/4">
          <h1 className="text-3xl font-bold mb-4 text-dark">{title}</h1>
          <p className="text-subtext">{description}</p>
        </div>

        {/* Center: Image Viewer with hover zones */}
        <div className="md:w-2/5">
          <div className="relative group  rounded-lg">
            <img
              src={images[currentImage]}
              alt={`${title} ${currentImage + 1}`}
              className="w-full h-96 object-cover"
            />
            {/* Prev on hover left */}
            <div
              className="absolute hover:bg-gradient-to-l from-transparent to-dark inset-y-0 -left-8 w-1/5 "
              onMouseEnter={handlePrevEnter}
              onMouseLeave={handlePrevLeave}
              style={{cursor: CURSOR_LEFT}}
            />
            {/* Next on hover right */}
            <div
              className="absolute hover:bg-gradient-to-r from-transparent to-dark inset-y-0 -right-8 w-1/5 "
              onMouseEnter={handleNextEnter}
              onMouseLeave={handleNextLeave}
              style={{cursor: CURSOR_RIGHT}}
            />
          </div>
        </div>

        {/* Right: Sizes & Add to Cart */}
        <div className="md:w-1/4">
          <h2 className="text-xl font-semibold mb-2 text-subtext">Sizes</h2>
          <div className="flex gap-2 mb-4">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-4 py-2 border rounded enabled:cursor-pointer ${selectedSize === size
                    ? 'bg-dark text-light'
                    : 'border-border text-dark'
                  } transition`}
              >
                {size}
              </button>
            ))}
          </div>
          <button
            className="relative inline-block w-full mx-auto overflow-hidden py-3 px-6 text-sm font-semibold uppercase tracking-widest text-dark border border-light bg-light group enabled:cursor-pointer"
          >
            {/* Text */}
            <span className="relative z-10 transition-colors duration-300 group-hover:text-light">
              Add to Bag
            </span>

            {/* Sliding white panel */}
            <span className="absolute inset-0 bg-dark transform -translate-x-full transition-transform duration-300 group-hover:translate-x-0 z-0" />
          </button>
        </div>
      </div>

      {/* ─────── MOBILE LAYOUT ─────── */}
      <div className="md:hidden flex flex-col space-y-6">
        {/* Image Carousel (scroll-snap) */}
        <div className="overflow-x-auto snap-x snap-mandatory -mx-4 px-4">
          <div className="flex space-x-4">
            {images.map((img, idx) => (
              <div key={idx} className="snap-start flex-shrink-0 w-full">
                <img
                  src={img}
                  alt={`${title} ${idx + 1}`}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-dark">{title}</h1>

        {/* Sizes & Add to Cart */}
        <div>
          <h2 className="font-semibold mb-2 text-subtext">Sizes</h2>
          <div className="flex gap-2 mb-4">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-4 py-2 border rounded ${selectedSize === size
                    ? 'bg-dark text-light'
                    : 'border-border text-dark'
                  } transition`}
              >
                {size}
              </button>
            ))}
          </div>
          <button
            className="relative inline-block w-full mx-auto overflow-hidden py-3 px-6 text-sm font-semibold uppercase tracking-widest text-dark border border-light bg-light group enabled:cursor-pointer"
          >
            {/* Text */}
            <span className="relative z-10 transition-colors duration-300 group-hover:text-light">
              Add to Bag
            </span>

            {/* Sliding white panel */}
            <span className="absolute inset-0 bg-dark transform -translate-x-full transition-transform duration-300 group-hover:translate-x-0 z-0" />
          </button>
        </div>

        {/* Description */}
        <p className="text-subtext">{description}</p>
      </div>
    </div>
  );
}