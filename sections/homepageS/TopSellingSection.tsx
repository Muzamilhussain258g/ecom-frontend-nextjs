'use client'
import { Swiper, SwiperSlide } from 'swiper/react'
import "swiper/css";
import { Autoplay, FreeMode } from 'swiper/modules';
import Button from '@/components/Button'
import React from 'react'
import ProductCard, { ProductCardData } from '@/components/ProductCard'
import Heading from '@/components/Heading'
import Link from 'next/link'

interface TopSellingSectionProps {
    products?: ProductCardData[]
}

const TopSellingSection = ({ products = [] }: TopSellingSectionProps) => {
    return (
        <section className='py-15'>
            <div className="container mx-auto">
                <Heading text='top selling' />

                <Swiper className='mt-13 mb-9'
                    modules={[Autoplay, FreeMode]}
                    breakpoints={
                        {
                            640: {
                                slidesPerView: 2,
                                spaceBetween: 10,
                            },
                            
                            768: {
                                slidesPerView: 2,
                                spaceBetween: 10,
                            },

                            1024: {
                                slidesPerView: 4,
                                spaceBetween: 40,
                            },
                        }
                    }
                    speed={2000}
                        slidesPerView={1.5}
                        spaceBetween={20}
                >
                    {products.map(el => (
                        <SwiperSlide key={el.id}>
                            <ProductCard product={el} />
                        </SwiperSlide>
                    ))}
                </Swiper>

                <Link href="/products" className="block mx-auto w-fit">
                    <Button btnProps={{
                        text: "View All",
                        variant: "white",
                        className: "block mx-auto"
                    }} />
                </Link>
            </div>
        </section>
    )
}

export default TopSellingSection
