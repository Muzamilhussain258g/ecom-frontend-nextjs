import Heading from '@/components/Heading'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const CategorySection = () => {
    return (
        <section>
            <div className="container">
                <div className=' mx-auto bg-tertiary py-15 rounded-4xl'>
                    <Heading text='BROWSE BY dress STYLE' />
                    <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-3 p-5 lg:p-16'>
                        <div className='relative  bg-secondary h-[290px] overflow-hidden rounded-2xl p-9'>
                            <h3 className='relative z-1 text-primary font-satoshi-bold text-2xl sm:text-[36px]'>Casual</h3>
                            <Image src={"/images/gym.png"} alt='shirt' height={400} width={400} className='absolute inset-e-0 top-0 ' />
                        </div>
                        <div className='lg:col-span-2 relative bg-secondary h-[290px] overflow-hidden rounded-2xl p-9'>
                            <h3 className='relative z-1 text-primary font-satoshi-bold text-2xl sm:text-[36px]'>Formal</h3>
                            <Image src={"/images/gym.png"} alt='shirt' height={400} width={400} className='absolute inset-e-0 top-0' />
                        </div>
                        <div className='lg:col-span-2 relative bg-secondary h-[290px] overflow-hidden rounded-2xl p-9'>
                            <h3 className='relative z-1 text-primary font-satoshi-bold text-2xl sm:text-[36px]' >Party</h3>
                            <Image src={"/images/gym.png"} alt='shirt' height={400} width={400} className='absolute inset-e-0 top-0' />
                        </div>
                        <div className='relative bg-secondary h-[290px] overflow-hidden rounded-2xl p-9'>
                            <h3 className='relative z-1 text-primary font-satoshi-bold text-2xl sm:text-[36px]'>Gym</h3>
                            <Image src={"/images/gym.png"} alt='shirt' height={400} width={400} className='absolute inset-e-0 top-0' />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default CategorySection