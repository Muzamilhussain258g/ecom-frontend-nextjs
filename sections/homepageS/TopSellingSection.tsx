'use client'
import { Swiper, SwiperSlide } from 'swiper/react'
import "swiper/css";
import Image from 'next/image';
import { Autoplay, FreeMode } from 'swiper/modules';


import Button from '@/components/Button'
import React from 'react'
import { products } from './NewArrivalSection'
import ProductCard from '@/components/ProductCard'
import Heading from '@/components/Heading'

const TopSellingSection = () => {
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

                            // 1280: {
                            //     slidesPerView: 6,
                            //     spaceBetween: 30,
                            // },
                        }
                    }
                    // freeMode={true}
                    speed={2000}
                    // autoplay={{
                        //     delay: 0,
                        //     // disableOnInteraction: false,
                        // }}
                        // loop={true}
                        slidesPerView={1.5}
                        spaceBetween={20}
                >
                    {products.map(el => (
                        <SwiperSlide><ProductCard product={el} key={el.id} /></SwiperSlide>
                    ))}
                </Swiper>

                {/* <div className='grid lg:grid-cols-3 2xl:grid-cols-4 grid-cols-2 gap-5 mt-13 mb-9'>
                    {products.map(el => (
                        <ProductCard product={el} key={el.id} />
                    ))}
                </div> */}
                <Button btnProps={{
                    text: "View All",
                    variant: "white",
                    className: "block mx-auto"
                }} />
            </div>
        </section>
    )
}

export default TopSellingSection