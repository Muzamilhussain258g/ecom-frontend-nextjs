'use client'
import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import "swiper/css";
import Image from 'next/image';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

interface ProductGalleryProps {
    images?: string[]
    alt?: string
}

function ProductGallery({
    images = ["/images/shirt2.png"],
    alt = "Product image",
}: ProductGalleryProps) {
    const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
    const gallery = images.length ? images : ["/images/shirt2.png"]

    return (
        <div className='grid grid-cols-8 gap-4'>
            <div className='col-span-8 lg:col-span-2 max-lg:order-2'>
                <Swiper
                    onSwiper={setThumbsSwiper}
                    slidesPerView={3}
                    freeMode={true}
                    direction='horizontal'
                    watchSlidesProgress={true}
                    modules={[FreeMode, Navigation, Thumbs]}
                    breakpoints={{
                        1024: {
                            direction: "vertical",
                            slidesPerView: 'auto',
                        }
                    }}
                    className="mySwiper max-h-[600px]"
                >
                    {gallery.map((src, i) => (
                        <SwiperSlide key={`${src}-${i}`} >
                            <Image
                                src={src}
                                width={500}
                                height={500}
                                alt={`${alt} ${i + 1}`}
                                className='max-h-full'
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
            <div className='col-span-8 lg:col-span-6'>
                <Swiper
                    spaceBetween={10}
                    thumbs={{ swiper: thumbsSwiper }}
                    modules={[FreeMode, Navigation, Thumbs]}
                    className="mySwiper2"
                >
                    {gallery.map((src, i) => (
                        <SwiperSlide key={`main-${src}-${i}`}>
                            <div className='lg:h-[600px] rounded-2xl overflow-hidden relative'>
                                <Image
                                    src={src}
                                    alt={`${alt} ${i + 1}`}
                                    height={500}
                                    width={500}
                                    className='h-full w-full'
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div >
    );
}

export default ProductGallery
