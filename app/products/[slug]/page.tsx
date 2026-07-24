'use client'
import { Swiper, SwiperSlide } from 'swiper/react'
import "swiper/css";
import Image from 'next/image';
import { Autoplay, FreeMode } from 'swiper/modules';
import ProductDetailSection from '@/sections/productdetailpageS/ProductDetailSection';
import ProductTabsSection from '@/sections/productdetailpageS/ProductTabsSection';
import RelatedProductsSection from '@/sections/productdetailpageS/RelatedProductsSection';


export default function page() {
    return (<>
        <ProductDetailSection />
        <ProductTabsSection />
        <RelatedProductsSection />
    </>)
}
