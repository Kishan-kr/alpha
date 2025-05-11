// src/components/CurvedCarousel.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function CurvedCarousel({
  items,
  radius = 300,         // circle radius (px)
  angleStep = 30,       // degrees between adjacent items
  width = 200,          // card width (px)
  height = 300,         // card height (px)
  transition = {        // Framer Motion transition
    type: 'spring',
    stiffness: 300,
    damping: 30
  }
}) {
  const [current, setCurrent] = useState(0);
  const count = items.length;

  const prev = () => setCurrent((current - 1 + count) % count);
  const next = () => setCurrent((current + 1) % count);

  // given an offset from the “current” index, compute x, y
  const getPos = (offset) => {
    const deg = offset * angleStep;
    const rad = deg * Math.PI / 180;
    return {
      x: radius * Math.sin(rad),
      y: radius * (1 - Math.cos(rad)),
      rotate: deg,
      zIndex: count - Math.abs(offset),
      // scale: 1 - Math.abs(offset) * 0.1,
      // opacity: 1 - Math.abs(offset) * 0.2
      scale: 1,
      opacity: 1
    };
  };

  return (
    <div className="relative w-full h-[400px] flex items-center justify-center overflow-visible">
      {/* Left arrow */}
      <button
        onClick={prev}
        className="absolute left-8 md:left-50 top-3/4 -translate-y-1/2 -rotate-[15deg] z-10 backdrop-blur-md bg-dark/40 hover:bg-white/10 p-4 rounded-full"
      >
        <ArrowLeft className="text-white w-6 h-6" />
      </button>

      {/* Carousel stage */}
      <div className="relative w-full h-full flex items-end justify-center overflow-visible">
        {items.map((item, idx) => {
          // compute shortest difference around the circle
          let offset = idx - current;
          if (offset > count / 2) offset -= count;
          if (offset < -count / 2) offset += count;
          // only render items within visible window
          if (Math.abs(offset) > Math.floor(count / 2)) return null;

          const { x, y, zIndex, scale, opacity, rotate } = getPos(offset);
          return (
            <motion.div
              key={idx}
              initial={false}
              animate={{ x, y, scale, opacity, rotate }}
              transition={transition}
              style={{ zIndex, transformOrigin: 'center center' }}
              className="absolute"
            >
              <div
                className="rounded-full bg-surface overflow-hidden"
                style={{ width, height }}
              >
                {item}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Right arrow */}
      <button
        onClick={next}
        className="absolute right-8 md:right-50 top-3/4 -translate-y-1/2 rotate-[15deg] z-10 backdrop-blur-md bg-dark/40 hover:bg-white/10 p-4 rounded-full"
      >
        <ArrowRight size={20} className="text-white" />
      </button>
    </div>
  );
}