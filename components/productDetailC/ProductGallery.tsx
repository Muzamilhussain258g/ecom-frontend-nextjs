'use client'
import React, { useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import "swiper/css";
import Image from 'next/image';

// import required modules
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';


function ProductGallery() {
    const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
    return (
        <div className='grid grid-cols-8  gap-4'>
            <div className='col-span-2'>
                <Swiper
                    onSwiper={setThumbsSwiper}
                    spaceBetween={15}
                    slidesPerView={3}
                    freeMode={true}
                    direction='vertical'
                    watchSlidesProgress={true}
                    modules={[FreeMode, Navigation, Thumbs]}
                    className="mySwiper max-h-[600px]"
                >
                    {[...Array(10)].map((_, i) => (
                        <SwiperSlide key={i} >
                                <Image
                                    src={`/images/shirt2.png`}  // agar tumhare images shirt1.png, shirt2.png ... shirt10.png hain
                                    width={500}
                                    height={500}
                                    alt={`Shirt ${i + 1}`}
                                    className='max-h-full'

                                />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
            <div className='col-span-6'>
                <Swiper
                    spaceBetween={10}
                    // navigation={true}
                    thumbs={{ swiper: thumbsSwiper }}
                    modules={[FreeMode, Navigation, Thumbs]}
                    className="mySwiper2"
                >
                    {[...Array(10)].map((_, i) => (
                        <SwiperSlide key={i}>
                            <div className='h-[600px] rounded-2xl overflow-hidden relative'>
                                <Image
                                    src={`/images/shirt2.png`}  // agar tumhare images shirt1.png, shirt2.png ... shirt10.png hain

                                    alt={`Shirt ${i + 1}`}
                                    fill
                                    objectFit='cover'
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>


        </div>
    );
}

export default ProductGallery