'use client'
import { Swiper, SwiperSlide } from 'swiper/react'
import "swiper/css";
import Image from 'next/image';
import { Autoplay, FreeMode } from 'swiper/modules';
import ProductDetailSection from '@/sections/detailpageS/ProductDetailSection';


export default function page() {
    return (
        <ProductDetailSection />
    )
}
