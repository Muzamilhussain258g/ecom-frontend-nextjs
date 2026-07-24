"use client"
import Heading from '@/components/Heading'
import React, { useRef } from 'react'
import { Autoplay, FreeMode, Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
// @ts-ignore
import ReactStars from 'react-stars'
import { Swiper as SwiperType } from "swiper";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import 'swiper/css/navigation';
import ReviewCard from '@/components/ReviewCard'


const ReviewsSection = () => {
    // const swiperRef = useRef<SwiperType | null>(null);

    return (
        <section className='py-15'>
            <div className='container mx-auto flex justify-between'>
                <Heading text='OUR HAPPY CUSTOMERS' className={'text-left'} />
                <div className="flex gap-5 text-primary">
                    <button
                        className="
                        review-prev
                        cursor-pointer
                        "
                        aria-label="Previous review"
                    >
                        <ArrowLeft />
                    </button>

                    <button
                        className="
                        review-next
                        cursor-pointer
                        "
                        aria-label="Next review"
                    >
                        <ArrowRight />
                    </button>
                </div>
            </div>
            <Swiper className='review-slider'
                spaceBetween={10}
                modules={[Navigation]}
                navigation={{
                    prevEl: ".review-prev",
                    nextEl: ".review-next",
                }}
                // onSwiper={(swiper) => {
                //     swiperRef.current = swiper;
                // }}
                breakpoints={
                    {
                        // 640: {
                        //     slidesPerView: 2,
                        //     spaceBetween: 30,
                        // },

                        // 768: {
                        //     slidesPerView: 3,
                        //     spaceBetween: 15,
                        // },

                        1024: {
                            slidesPerView: 2,
                            spaceBetween: 10,
                        },

                        1280: {
                            slidesPerView: 3.5,
                            spaceBetween: 10,
                        },
                    }
                }
                speed={500}
                // autoplay={{
                //     delay: 0,
                //     // disableOnInteraction: false,
                // }}
                loop={true}
                slidesPerView={1.5}
                centeredSlides
            >


                {reviews.map(review => (
                    <SwiperSlide>
                        {/* <div className='py-7 px-8 rounded-2xl border-border-color border'>
                            <ReactStars
                                count={5}
                                size={24}
                                value={review.rating}
                                color2={'#ffd700'}
                                edit={false}

                            />
                            <div className='flex gap-1 text-[20px] items-center'>
                                <h3 className='font-bold text-[20px] text-primary'>{review.name}</h3>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 bg-[#01AB31] text-white rounded-full p-1">
                                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className='h-40 overflow-y-auto'>{review.review}</div>
                        </div> */}
                        <ReviewCard rating={review.rating} review={review.review} username={review.name}/>
                    </SwiperSlide>

                ))}
                {/* <SwiperSlide> </SwiperSlide>
                    <SwiperSlide> </SwiperSlide>
                    <SwiperSlide> </SwiperSlide>
                    <SwiperSlide> </SwiperSlide>
                    <SwiperSlide> </SwiperSlide>
                    <SwiperSlide> </SwiperSlide>
                    <SwiperSlide> </SwiperSlide>
                    <SwiperSlide> </SwiperSlide>
                    <SwiperSlide> </SwiperSlide>
                    <SwiperSlide> </SwiperSlide>
                    <SwiperSlide> </SwiperSlide>
                    <SwiperSlide> </SwiperSlide>
                    <SwiperSlide> </SwiperSlide>
                    <SwiperSlide> </SwiperSlide>
                    <SwiperSlide> </SwiperSlide>
                    <SwiperSlide> </SwiperSlide>
                    <SwiperSlide> </SwiperSlide>
                    <SwiperSlide> </SwiperSlide>
                    <SwiperSlide> </SwiperSlide>
                    <SwiperSlide> </SwiperSlide> */}
            </Swiper>
        </section>)
}

export default ReviewsSection

export const reviews = [
    {
        id: 1,
        name: "Sarah M.",
        rating: 5,
        review: "The quality is amazing. The fabric feels premium and the fitting is perfect. The quality is amazing. The fabric feels premium and the fitting is perfect. The quality is amazing. The fabric feels premium and the fitting is perfect. ",
        date: "August 14, 2025",
        avatar: "/images/user-1.png",
        verified: true,
    },
    {
        id: 2,
        name: "Alex K.",
        rating: 4.5,
        review: "Great product and fast delivery. The size was exactly as described. The quality is amazing. The fabric feels premium and the fitting is perfect. The quality is amazing. The fabric feels premium and the fitting is perfect. The quality is amazing. The fabric feels premium and the fitting is perfect.",
        date: "August 10, 2025",
        avatar: "/images/user-2.png",
        verified: true,
    },
    {
        id: 3,
        name: "James L.",
        rating: 5,
        review: "I love the design. Definitely buying more products from this store. The quality is amazing. The fabric feels premium and the fitting is perfect. The quality is amazing. The fabric feels premium and the fitting is perfect.",
        date: "July 28, 2025",
        avatar: "/images/user-3.png",
        verified: true,
    },
    {
        id: 4,
        name: "Emily R.",
        rating: 4,
        review: "Good quality and comfortable to wear. Delivery was also smooth. The quality is amazing. The fabric feels premium and the fitting is perfect. The quality is amazing. The fabric feels premium and the fitting is perfect.",
        date: "July 20, 2025",
        avatar: "/images/user-4.png",
        verified: false,
    },
    {
        id: 5,
        name: "Michael T.",
        rating: 4.5,
        review: "The product looks exactly like the pictures. Very satisfied with my purchase. The quality is amazing. The fabric feels premium and the fitting is perfect. The quality is amazing. The fabric feels premium and the fitting is perfect.",
        date: "July 15, 2025",
        avatar: "/images/user-5.png",
        verified: true,
    },
    {
        id: 6,
        name: "Olivia W.",
        rating: 5,
        review: "Amazing quality and comfortable material. Highly recommended. The quality is amazing. The fabric feels premium and the fitting is perfect. The quality is amazing. The fabric feels premium and the fitting is perfect.    ",
        date: "July 05, 2025",
        avatar: "/images/user-6.png",
        verified: true,
    },
    {
        id: 7,
        name: "Daniel P.",
        rating: 3.5,
        review: "The product is good but delivery took a little longer than expected.",
        date: "June 25, 2025",
        avatar: "/images/user-7.png",
        verified: false,
    },
    {
        id: 8,
        name: "Sophia K.",
        rating: 5,
        review: "Absolutely love it. The fit, design and quality are all excellent.",
        date: "June 18, 2025",
        avatar: "/images/user-8.png",
        verified: true,
    },
    {
        id: 9,
        name: "William H.",
        rating: 4,
        review: "Nice product with great finishing. Worth the price.",
        date: "June 10, 2025",
        avatar: "/images/user-9.png",
        verified: true,
    },
    {
        id: 10,
        name: "Emma J.",
        rating: 4.5,
        review: "Very stylish and comfortable. I would definitely buy again.",
        date: "June 02, 2025",
        avatar: "/images/user-10.png",
        verified: true,
    },
];