"use client"
import Button from '@/components/Button';
import Heading from '@/components/Heading';
import ProductCard, { ProductCardData } from '@/components/ProductCard';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';

interface NewArrivalSectionProps {
    products?: ProductCardData[]
}

const NewArrivalSection = ({ products = [] }: NewArrivalSectionProps) => {
    return (
        <section className='pt-15'>
            <div className="container mx-auto border-b border-border-color">
                <Heading text='New Arrivals' />

                <Swiper className='mt-13 mb-9'
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
                <div className='border-b border-border-color mt-16'></div>
            </div>

        </section>
    )
}

export default NewArrivalSection
