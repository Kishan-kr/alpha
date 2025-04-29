import React from 'react'
import horizontalHero from '../assets/photos/hero-section-horizontal.jpg'
import { ChevronDown } from 'lucide-react'

function Hero() {
  return (
    <div className='relative'>
      <img src={horizontalHero} alt="Hero" height={'100vh'} className='object-cover'/>
      <button className='bg-white absolute rounded-full p-2 text-black/60 shadow-md top-full left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer'>
        <ChevronDown className='w-6 h-6 md:w-8 md:h-8' strokeWidth={1} absoluteStrokeWidth={true} />
      </button>
    </div>
  )
}

export default Hero