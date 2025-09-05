import React, { useEffect, useRef } from 'react';
import heroLandscapePosterLocal from '../../assets/photos/hero_landscape_poster.jpg';
import heroPortraitPosterLocal from '../../assets/photos/hero_portrait_poster.jpg';
import { ArrowRight } from 'lucide-react';
import useMediaQuery from '../../hooks/useMediaQuery';

// Get base URLs from .env
const BASE_URL = import.meta.env.VITE_HERO_VIDEO_BASE || "https://cdn.tashn.in/videos/";

const heroPortraitMp4 = `${BASE_URL}hero_portrait.mp4`;
const heroPortraitWebm = `${BASE_URL}hero_portrait.webm`;
const heroPortraitPoster = `${BASE_URL}hero_portrait_poster.jpg`;

const heroLandscapeMp4 = `${BASE_URL}hero_landscape.mp4`;
const heroLandscapeWebm = `${BASE_URL}hero_landscape.webm`;
const heroLandscapePoster = `${BASE_URL}hero_landscape_poster.jpg`;

export default function Hero({ handleNewCollection }) {
  const desktopRef = useRef(null)
  const mobileRef = useRef(null)
  const heroRef = useRef(null)
  // check screen size
  const isMobile = useMediaQuery("(max-width: 768px)");

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
        poster={isMobile ? 
          heroPortraitPoster || heroPortraitPosterLocal : 
          heroLandscapePoster || heroLandscapePosterLocal
        }
      >
        {/* <source src={heroMobileVideo} media="(max-width: 768px)" type="video/mp4" />
        <source src={heroDestopVideo} media="(min-width: 769px)" type="video/mp4" /> */}

        {/* Portrait (mobile) */}
        <source
          src={heroPortraitWebm}
          media="(max-width: 768px)"
          type="video/webm"
        />
        <source
          src={heroPortraitMp4}
          media="(max-width: 768px)"
          type="video/mp4"
        />

        {/* Landscape (desktop) */}
        <source
          src={heroLandscapeWebm}
          media="(min-width: 769px)"
          type="video/webm"
        />
        <source
          src={heroLandscapeMp4}
          media="(min-width: 769px)"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30 z-10" />

      {/* Centered Title */}
      <div className="absolute inset-0 z-20 flex flex-col items-center gap-y-2 justify-center px-4 text-center">
        <h1 className="text-6xl md:text-8xl font-extrabold text-light">
          {/* Not Basic.<br />
          Just Essential. */}
          Effortlessly
        </h1>
        <h4 className='text-lg md:text-3xl font-extrabold text-light'>Elevated.</h4>
      </div>

      {/* CTA Button at Bottom */}
      <div className="absolute bottom-24 sm:bottom-9 w-full flex justify-center z-20">
        <button
          onClick={handleNewCollection}
          className="inline-flex text-lg group uppercase items-center px-7 py-2 text-light font-light border border-light hover:bg-light hover:text-dark transition-all duration-300 cursor-pointer"
        >
          Shop New Arrivals
          <ArrowRight className="ml-6 w-5 h-5 text-dark bg-light group-hover:text-white group-hover:bg-dark rounded-full p-1 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </section>
  );
}