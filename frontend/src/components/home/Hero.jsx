import React, { useEffect, useRef } from 'react';
import heroDestopVideo from '../../assets/videos/heroDestopVideo.mp4';
import heroMobileVideo from '../../assets/videos/heroMobileVideo.mp4';
import { ArrowRight } from 'lucide-react';

export default function Hero({ handleNewCollection }) {
  const desktopRef = useRef(null)
  const mobileRef = useRef(null)
  const heroRef = useRef(null)

  // Pause video when Hero scrolls out of view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          desktopRef.current?.pause()
          mobileRef.current?.pause()
        } else {
          desktopRef.current?.play().catch(() => { })
          mobileRef.current?.play().catch(() => { })
        }
      },
      { threshold: 0.2 }
    )

    if (heroRef.current) observer.observe(heroRef.current)

    return () => {
      if (heroRef.current) observer.unobserve(heroRef.current)
    }
  }, [])

  return (
    <section className="relative w-full h-screen overflow-hidden bg-black text-light">
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src={heroMobileVideo} media="(max-width: 768px)" type="video/mp4" />
        <source src={heroDestopVideo} media="(min-width: 769px)" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30 z-10" />

      {/* video credit  */}
      {/* <p className='absolute bottom-6 right-3 text-xs text-subtext'>Video by cottonbro studio</p> */}

      {/* Centered Title */}
      <div className="absolute inset-0 z-20 flex items-center justify-center px-4 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-white">
          Wear the culture,<br />
          own the streets.
        </h1>
      </div>

      {/* CTA Button at Bottom */}
      <div className="absolute bottom-18 sm:bottom-10 w-full flex justify-center z-20">
        <button
          onClick={handleNewCollection}
          className="inline-flex group items-center px-6 py-3 text-light font-semibold rounded-full shadow-md border border-light hover:bg-light hover:text-dark transition-all duration-300 cursor-pointer"
        >
          Shop New Arrivals
          <ArrowRight className="ml-2 w-5 h-5 text-dark bg-light group-hover:text-white group-hover:bg-dark rounded-full p-1 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </section>
  );
}