'use client'
import { Swiper, SwiperSlide } from 'swiper/react'
import "swiper/css";
import Image from 'next/image';
import { Autoplay, FreeMode } from 'swiper/modules';


const Slidder = () => {
    return (
        <Swiper className='bg-primary w-full py-10! brand-slider'
            spaceBetween={10}
            modules={[Autoplay, FreeMode]}
            breakpoints={
                {
                    640: {
                        slidesPerView: 3,
                        spaceBetween: 30,
                    },

                    768: {
                        slidesPerView: 4,
                        spaceBetween: 35,
                    },

                    1024: {
                        slidesPerView: 5,
                        spaceBetween: 40,
                    },

                    1280: {
                        slidesPerView: 6,
                        spaceBetween: 30,
                    },
                }
            }
            // freeMode={true}
            speed={2000}
            // autoplay={{
            //     delay: 0,
            //     // disableOnInteraction: false,
            // }}
            // loop={true}
            slidesPerView={3}
        >


            <SwiperSlide><Image src={"/images/prada.png"} width={194} height={100} alt='prada-logo ' className='prada-logo'  /></SwiperSlide>
            <SwiperSlide><Image src={"/images/prada.png"} width={194} height={194} alt='prada-logo ' className='prada-logo' /></SwiperSlide>
            <SwiperSlide><Image src={"/images/prada.png"} width={194} height={194} alt='prada-logo ' className='prada-logo' /></SwiperSlide>
            <SwiperSlide><Image src={"/images/prada.png"} width={194} height={194} alt='prada-logo ' className='prada-logo' /></SwiperSlide>
            <SwiperSlide><Image src={"/images/prada.png"} width={194} height={194} alt='prada-logo ' className='prada-logo' /></SwiperSlide>
            <SwiperSlide><Image src={"/images/prada.png"} width={194} height={194} alt='prada-logo ' className='prada-logo' /></SwiperSlide>
            <SwiperSlide><Image src={"/images/prada.png"} width={194} height={194} alt='prada-logo ' className='prada-logo' /></SwiperSlide>
            <SwiperSlide><Image src={"/images/prada.png"} width={194} height={194} alt='prada-logo ' className='prada-logo' /></SwiperSlide>
            <SwiperSlide><Image src={"/images/prada.png"} width={194} height={194} alt='prada-logo ' className='prada-logo' /></SwiperSlide>
            <SwiperSlide><Image src={"/images/prada.png"} width={194} height={194} alt='prada-logo ' className='prada-logo' /></SwiperSlide>
            <SwiperSlide><Image src={"/images/prada.png"} width={194} height={194} alt='prada-logo ' className='prada-logo' /></SwiperSlide>
            <SwiperSlide><Image src={"/images/prada.png"} width={194} height={194} alt='prada-logo ' className='prada-logo' /></SwiperSlide>
            <SwiperSlide><Image src={"/images/prada.png"} width={194} height={194} alt='prada-logo ' className='prada-logo' /></SwiperSlide>
            <SwiperSlide><Image src={"/images/prada.png"} width={194} height={194} alt='prada-logo ' className='prada-logo' /></SwiperSlide>
            <SwiperSlide><Image src={"/images/prada.png"} width={194} height={194} alt='prada-logo ' className='prada-logo' /></SwiperSlide>
            <SwiperSlide><Image src={"/images/prada.png"} width={194} height={194} alt='prada-logo ' className='prada-logo' /></SwiperSlide>
            <SwiperSlide><Image src={"/images/prada.png"} width={194} height={194} alt='prada-logo ' className='prada-logo' /></SwiperSlide>
            <SwiperSlide><Image src={"/images/prada.png"} width={194} height={194} alt='prada-logo ' className='prada-logo' /></SwiperSlide>
            <SwiperSlide><Image src={"/images/prada.png"} width={194} height={194} alt='prada-logo ' className='prada-logo' /></SwiperSlide>
            <SwiperSlide><Image src={"/images/prada.png"} width={194} height={194} alt='prada-logo ' className='prada-logo' /></SwiperSlide>
        </Swiper>
    )
}

export default Slidder