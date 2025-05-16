import React, { useState } from 'react';
import '../../styles/GlitchEffect.css';
import categories from '../../utils/categoriesArray';
import StaticGlitch from '../common/StaticRGBText';

const Categories = () => {
  const [activeCat, setActiveCat] = useState(categories[0]);
  const [glitchKey, setGlitchKey] = useState(0);

  const handleHover = (category) => {
    setActiveCat(category)
    setGlitchKey(prev => prev + 1); // force animation reset
  };

  return (
    <section className='py-20 bg-surface bg-gradient-to-br from-dark from-0% to-surface to-95%'>
      {/* title of the section  */}
      <div className='flex justify-center text-center'>
        <StaticGlitch
          text={'Explore Our Collections'}
          className='text-xl sm:text-2xl md:text-4xl uppercase font-semibold mx-auto text-white tracking-widest'
        />
      </div>

      <div className="flex flex-col md:flex-row gap-8 md:gap-x-16 lg:gap-x-36 items-center justify-center w-full h-full text-white my-12">
        {/* Left Panel */}
        <ul className="w-full md:w-1/3 p-8 select-none flex flex-col items-center md:items-start justify-center gap-4">
          {categories.map((cat) => (
            <li
              key={cat.name}
              className="group relative cursor-pointer w-fit text-base md:text-xl font-thin uppercase tracking-wider transition-colors duration-300"
              onMouseEnter={() => handleHover(cat)}
            >
              {cat.name}
              <span
                className="absolute bottom-0 left-0 h-px mt-1 w-full bg-white transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
              />
            </li>
          ))}
        </ul>

        {/* Right Panel */}
        <div className="relative min-w-72 sm:min-w-xs h-[390px] sm:h-[420px] sm:px-3">
          {/* glitched image  */}
          <div key={glitchKey} className="glitch imgloaded">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`glitch__img ${i === 1 ? 'glitch-1' : i === 2 ? 'glitch-2' : i === 3 ? 'glitch-3' : i === 4 ? 'glitch-flash' : ''}`}
                style={{ backgroundImage: `url(${activeCat.image})` }}
              />
            ))}
          </div>

          {/* glitched text */}
          <p key={glitchKey + "text"} className='content__title select-none absolute top-1/2 left-1/2 text-5xl sm:text-7xl text-center text-white -translate-1/2 text-shadow-lg overflow-visible'>{activeCat.name}</p>
        </div>
      </div>
    </section>
  );
};

export default Categories;