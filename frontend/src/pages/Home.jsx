import React, { useRef } from 'react'
import Hero from '../components/home/Hero';
import LatestProducts from '../components/home/LatestProducts';
import CustomerDiaries from '../components/home/CustomerDiaries';
import Categories from '../components/home/Categories';
import Lookbook from '../components/home/Lookbook';

import video1 from '../assets/videos/video1.mp4'
import video2 from '../assets/videos/video2.mp4'
import video3 from '../assets/videos/video3.mp4'

// video list for lookbook 
const videoList = [video1, video2, video3, video1]

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
      <Categories />
      <Lookbook videos={videoList}/>
    </div>
  );
}