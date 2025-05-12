import React, { useRef } from 'react'
import Hero from '../components/home/Hero';
import LatestProducts from '../components/home/LatestProducts';
import CustomerDiaries from '../components/home/CustomerDiaries';

export default function Home() {
  const latestProductsSection = useRef(null);

  const scrollToProductsSection = () => {
    latestProductsSection.current?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="">
      <Hero handleNewCollection={scrollToProductsSection}/>
      <LatestProducts scrollRef={latestProductsSection}/>
      <CustomerDiaries />
    </div>
  );
}