import React, { useRef } from 'react'
import Hero from '../components/home/Hero';
import Statement from '../components/home/Statement';
import LatestProducts from '../components/home/LatestProducts';
import Testimonials from '../components/home/Testimonials';

export default function Home() {
  const latestProductsSection = useRef(null);

  const scrollToProductsSection = () => {
    latestProductsSection.current?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="">
      <Hero handleNewCollection={scrollToProductsSection}/>
      <Statement />
      <LatestProducts scrollRef={latestProductsSection}/>
      <Testimonials />
    </div>
  );
}