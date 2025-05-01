import React from 'react'
import Hero from '../components/Hero';
import Statement from '../components/Statement';
import LatestProducts from '../components/LatestProducts';

export default function Home() {
  return (
    <div className="">
      <Hero />
      <Statement />
      <LatestProducts />
    </div>
  );
}