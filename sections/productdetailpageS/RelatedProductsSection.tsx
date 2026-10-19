"use client"

import Button from '@/components/Button'
import Heading from '@/components/Heading'
import ProductCard, { ProductCardData } from '@/components/ProductCard'
import Link from 'next/link'
import React from 'react'
import { Autoplay, FreeMode } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

interface RelatedProductsSectionProps {
    products?: ProductCardData[]
}

const RelatedProductsSection = ({ products = [] }: RelatedProductsSectionProps) => {
    return (
        <section className='py-15'>
            <div className="container mx-auto">
                <Heading text='You might also like' />

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
                    {products.map((product) => (
                        <SwiperSlide key={product.id}>
                            <ProductCard product={product} />
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

export default RelatedProductsSection
