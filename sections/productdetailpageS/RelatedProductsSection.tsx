import Button from '@/components/Button'
import Heading from '@/components/Heading'
import ProductCard from '@/components/ProductCard'
import React from 'react'
import { Autoplay, FreeMode } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

const RelatedProductsSection = () => {
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
                    {[...Array(4)].map((_, i) => (
                        <SwiperSlide><ProductCard product={{
                            id: 1,
                            name: "T-shirt with Tape Details",
                            image: "/images/shirt.png",
                            rating: 4.5,
                            reviews: 225,
                            price: 120,
                            oldPrice: null,
                            discount: null,
                            category: "T-shirts",
                        }} key={i} /></SwiperSlide>
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

export default RelatedProductsSection