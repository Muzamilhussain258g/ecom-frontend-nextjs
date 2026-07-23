import Button from '@/components/Button'
import Image from 'next/image'
import React from 'react'

const HeroSection = () => {
    return (
        <section className='bg-tertiary'>
            <div className='container mx-auto grid md:grid-cols-2 items-end'>
                <div className='py-15'>
                    <h1 className='capitalize text-primary text-[36px] lg:text-[40px] 2xl:text-[64px] max-w-150'>find clothes that matches your vibe</h1>
                    <p className='max-w-150 my-8'>Browse through our diverse range of meticulously crafted garments, designed to bring out your individuality and cater to your sense of style.</p>
                    <Button btnProps={{ text: "Shop Now", variant: "black" }} />
                    <div className='mt-12 flex md:gap-12 gap-4 flex-wrap max-md:justify-center'>
                        <div>
                            <h3 className='font-satoshi-bold! text-[30px] md:text-[40px] text-primary'>200+</h3>
                            <div>International Brands</div>
                        </div>
                        <div>
                            <h3 className='font-satoshi-bold! text-[30px] md:text-[40px] text-primary'>2,000+</h3>
                            <div>High-Quality Products</div>
                        </div>
                        <div>
                            <h3 className='font-satoshi-bold! text-[30px] md:text-[40px] text-primary'>30,000+</h3>
                            <div>High-Quality Products</div>
                        </div>

                    </div>
                </div>
                <Image src={'/images/heroimage2.png'} height={1000} width={10000} alt='heroimage' className='' />
            </div>
        </section>
    )
}

export default HeroSection