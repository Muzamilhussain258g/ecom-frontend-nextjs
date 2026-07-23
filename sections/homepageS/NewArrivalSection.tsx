"use client"
import Button from '@/components/Button';
import Heading from '@/components/Heading';
import ProductCard, { ProductCardData } from '@/components/ProductCard';
import { Swiper, SwiperSlide } from 'swiper/react';

const NewArrivalSection = () => {
    return (
        <section className='pt-15'>
            <div className="container mx-auto border-b border-border-color">
                <Heading text='New Arrivals' />

                <Swiper className='mt-13 mb-9'
                    // modules={[Autoplay, FreeMode]}
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
                <div className='border-b border-border-color mt-16'></div>
            </div>

        </section>
    )
}

export default NewArrivalSection

export const products: ProductCardData[] = [
    {
        id: 1,
        name: "T-shirt with Tape Details",
        image: "/images/shirt.png",
        rating: 4.5,
        reviews: 225,
        price: 120,
        oldPrice: null,
        discount: null,
        category: "T-shirts",
    },
    {
        id: 2,
        name: "Skinny Fit Jeans",
        image: "/images/shirt.png",
        rating: 3.5,
        reviews: 120,
        price: 240,
        oldPrice: 260,
        discount: "-20%",
        category: "Jeans",
    },
    {
        id: 3,
        name: "Checkered Shirt",
        image: "/images/shirt.png",
        rating: 4.5,
        reviews: 180,
        price: 180,
        oldPrice: null,
        discount: null,
        category: "Shirts",
    },
    {
        id: 4,
        name: "Sleeve Striped T-shirt",
        image: "/images/shirt.png",
        rating: 4.5,
        reviews: 95,
        price: 130,
        oldPrice: 160,
        discount: "-30%",
        category: "T-shirts",
    },
];