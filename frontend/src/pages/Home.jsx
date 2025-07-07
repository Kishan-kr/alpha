import React, { useEffect, useRef } from 'react'
import Hero from '../components/home/Hero';
import LatestProducts from '../components/home/LatestProducts';
import CustomerDiaries from '../components/home/CustomerDiaries';
import Categories from '../components/home/Categories';
import Lookbook from '../components/home/Lookbook';

import { useDispatch, useSelector } from 'react-redux';
import { fetchHomeReviews, fetchLookbookVideos, fetchNewArrivals } from '../store/actions/homeAction';

export default function Home() {
  const latestProductsSection = useRef(null);
  const dispatch = useDispatch();
  const { lookbookVideos, reviews } = useSelector(state => state.home);
  
  useEffect(() => {
    dispatch(fetchNewArrivals())
    dispatch(fetchHomeReviews())
    dispatch(fetchLookbookVideos())
  }, []);

  const scrollToProductsSection = () => {
    latestProductsSection.current?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="">
      <Hero handleNewCollection={scrollToProductsSection}/>
      <LatestProducts scrollRef={latestProductsSection}/>
      <CustomerDiaries status={reviews?.status} reviews={reviews?.items}/>
      <Categories />
      <Lookbook status={lookbookVideos?.status} videos={lookbookVideos?.items}/>
    </div>
  );
}