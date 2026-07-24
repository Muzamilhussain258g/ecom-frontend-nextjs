import Footer from '@/components/Footer'
import Header from '@/components/Header'
import Slidder from '@/components/Slidder'
import CategorySection from '@/sections/homepageS/CategorySection'
import HeroSection from '@/sections/homepageS/HeroSection'
import NewArrivalSection from '@/sections/homepageS/NewArrivalSection'
import ReviewsSection from '@/sections/homepageS/ReviewsSection'
import TopSellingSection from '@/sections/homepageS/TopSellingSection'
import UpToDateSection from '@/sections/homepageS/UpToDateSection'
import React from 'react'

const page = () => {
  return (
    <>
      <HeroSection />
      <Slidder />
      <NewArrivalSection />
      <TopSellingSection />
      <CategorySection />
      <ReviewsSection />
      
    </>
  )
}

export default page