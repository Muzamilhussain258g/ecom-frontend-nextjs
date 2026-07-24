import { Mail } from 'lucide-react'
import React from 'react'

const UpToDateSection = () => {
    return (
        <section>
            <div className="container">
                <div className="py-10 px-10 lg:px-22 grid md:grid-cols-2 bg-primary gap-8 rounded-3xl z-2 relative">
                    <h2 className='text-[30px] lg:text-[40px] text-secondary'>STAY UPTO DATE ABOUT OUR LATEST OFFERS</h2>
                    <div className='md:ml-auto lg:w-87.5 flex flex-col justify-center'>
                        <div className='flex gap-2 bg-secondary rounded-full py-3 px-4 '>
                            <Mail />
                            <input type="text" placeholder='Enter your email address' />
                        </div>
                        <div className='text-primary bg-secondary rounded-full py-3 px-4 mt-4 '>
                            Subscribe to Newsletter
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default UpToDateSection