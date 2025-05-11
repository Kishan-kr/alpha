import React from 'react';
import { ArrowRight } from 'lucide-react';
import CurvedCarousel from '../common/CurvedCarousel';

export default function Hero({handleNewCollection}) {
  const items = Array.from({ length: 6 }, (_, i) => (
    `https://picsum.photos/id/${i + 10}/500/800`
  ));

  return (
    <section className="bg-dark text-light relative pt-24 pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 text-center mb-12">
        <p className="inline-block px-4 py-1 mb-4 text-xs font-medium border border-white/20 rounded-full uppercase tracking-widest text-subtext">
          New spring collection 2025
        </p>

        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
        Style Sabke Paas Hai, Tashn <br />
        Khaas Hai
        </h1>

        <p className="text-subtext max-w-xl mx-auto mb-8">
          Unveiling a fashion destination where trends blend seamlessly with your individual style aspirations. Discover today!
        </p>

        <button onClick={handleNewCollection} className="inline-flex group items-center px-6 py-3 bg-light text-dark font-semibold rounded-full shadow-md hover:bg-white cursor-pointer">
          New collection
          <ArrowRight className="ml-2 w-5 h-5 text-white bg-dark rounded-full p-1 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      {/* Curved Carousel */}
      <CurvedCarousel
        items={items.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`Slide ${i + 1}`}
            className="w-full h-full object-cover"
          />
        ))}
        radius={2440}
        angleStep={6.4}
        width={240}
        height={390}
      />
    </section>
  );
}
