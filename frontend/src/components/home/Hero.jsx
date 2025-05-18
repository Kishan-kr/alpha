// src/components/Hero.jsx
import React from 'react'
import modelSittingOnChair from '../../assets/photos/modelSittingOnChair.png';
import modelBlueTee from '../../assets/photos/modelBlueTee.png';
import modelGirlBlackTee from '../../assets/photos/modelGirlBlackTee.png';
import modelGirlWithBag from '../../assets/photos/modelGirlWithBag.png';
import modelYellowTee from '../../assets/photos/modelYellowTee.png';
import modelOrangeTee from '../../assets/photos/modelOrangeTee.png';
import { ArrowRight } from 'lucide-react';


export default function Hero({ handleNewCollection }) {

  return (
    <section className="relative bg-dark text-light py-12 px-4 md:py-24 md:px-16 pt-24 md:pt-28 overflow-hidden z-0">
      <div className='w-full absolute top-0 -left-8 h-[calc(200%)] bg-surface origin-top-left -rotate-45 -z-10 bg-gradient-to-r from-surface from-0% to-dark to-10%'></div>
      <div className="max-w-6xl mx-auto relative">
        {/* Main title */}
        <h1 className="text-center text-4xl md:text-6xl font-extrabold leading-tight">
          Made for the Unapologetic.<br />
          Worn by the Original.
        </h1>

        {/* Subtitle block */}
        <div className="absolute hidden md:block left-0 md:left-4 top-36 md:top-32 mt-8 text-left md:text-center">
          <p className="text-subtext uppercase tracking-wider text-[8px] md:text-xs">
            Spring Collection ’25
          </p>
          <h2 className="mt-2 text-xs md:text-lg font-semibold">
            Trendy and Classy Picks<br />
            For Fresh Start
          </h2>
        </div>

        {/* Desktop grid */}
        <div className="hidden md:grid grid-cols-5 grid-rows-12 gap-4 h-96 md:h-[425px] mt-4">
          <div className="rounded-md col-start-1 col-end-2 row-start-4 row-end-10 bg-surface/60 overflow-hidden">
            <img src={modelBlueTee} alt="Model in Blue T-shirt" className='w-full h-auto bg-cover scale-125 relative top-6' />
          </div>
          <div className="rounded-md col-start-2 col-end-3 row-start-6 row-end-11 bg-surface/60 overflow-hidden">
            <img src={modelGirlBlackTee} alt="" className='w-full h-auto bg-cover scale-125' />
          </div>
          <div className="rounded-md col-start-2 col-end-3 row-start-3 row-end-6 bg-surface/60 overflow-hidden">
            <img src={modelOrangeTee} alt="" className='w-full h-auto bg-cover scale-150' />
          </div>
          <div className="rounded-md col-start-3 col-end-4 row-start-2 row-end-12 bg-surface/60 overflow-hidden">
            <img src={modelSittingOnChair} alt="" className='w-full h-auto bg-cover scale-125 relative top-8' />
          </div>
          <div className="rounded-md col-start-4 col-end-5 row-start-3 row-end-8 bg-surface/60 overflow-hidden">
            <img src={modelYellowTee} alt="" className='w-full h-auto bg-cover scale-150' />
          </div>
          <div className="rounded-md col-start-4 col-end-5 row-start-8 row-end-11 bg-surface/60 overflow-hidden">
            <p className='text-lg text-subtext text-center mt-2'>Style with</p>
            <p className='text-5xl text-center text-light'>Tashn</p>
          </div>
          <div className="rounded-md col-start-5 col-end-6 row-start-4 row-end-10 bg-surface/60 overflow-hidden">
            <img src={modelGirlWithBag} alt="" className='w-full h-auto bg-cover relative -top-16' />
          </div>
        </div>


        {/* Mobile grid */}
        <div className="grid md:hidden grid-cols-7 grid-rows-12 gap-3 h-96 mt-4">
          <div className="rounded-md col-start-1 col-end-3 row-start-4 row-end-8 bg-surface/60 overflow-hidden">
            <img src={modelBlueTee} alt="" className='w-full h-auto bg-cover scale-150 relative top-8' />
          </div>
          <div className="rounded-md col-start-1 col-end-3 row-start-8 row-end-10 bg-surface/60 overflow-hidden">
            <p className='text-xs text-subtext text-center mt-[2px]'>Style with</p>
            <p className='text-3xl text-center text-light'>Tashn</p>
          </div>
          <div className="rounded-md col-start-3 col-end-6 row-start-2 row-end-9 bg-surface/60 overflow-hidden">
            <img src={modelSittingOnChair} alt="" className='w-full h-auto bg-cover' />
          </div>
          <div className="rounded-md col-start-3 col-end-6 row-start-9 row-end-12 bg-surface/60 overflow-hidden">
            <img src={modelGirlBlackTee} alt="" className='w-full h-auto bg-cover scale-110' />
          </div>
          <div className="rounded-md col-start-6 col-end-8 row-start-3 row-end-6 bg-surface/60 overflow-hidden">
            <img src={modelYellowTee} alt="" className='w-full h-auto bg-cover scale-150' />
          </div>
          <div className="rounded-md col-start-6 col-end-8 row-start-6 row-end-10 bg-surface/60 overflow-hidden">
            <img src={modelGirlWithBag} alt="" className='w-full h-auto bg-cover' />
          </div>
          <div className="rounded-md col-start-6 col-end-8 row-start-10 row-end-11 bg-surface/60 overflow-hidden">
            <img src={modelOrangeTee} alt="" className='w-full h-auto bg-cover relative -top-8' />
          </div>
        </div>

        {/* CTA button */}
        <div className="mt-10 text-center">
          <button onClick={handleNewCollection} className="inline-flex group items-center px-6 py-3 bg-light text-dark font-semibold rounded-full shadow-md hover:bg-white cursor-pointer">
            Shop New Arrivals
            <ArrowRight className="ml-2 w-5 h-5 text-white bg-dark rounded-full p-1 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  )
}