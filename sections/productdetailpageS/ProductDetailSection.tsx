import Button from '@/components/Button'
import ProductGallery from '@/components/productDetailC/ProductGallery'
import RatingStars from '@/components/RatingStars'
import { Minus, Plus } from 'lucide-react'
import React from 'react'
import { IoCheckmarkOutline } from 'react-icons/io5'

function ProductDetailSection() {
    return (
        <main className="py-10">
            <div className='container grid md:grid-cols-2 md:gap-5 lg:gap-10 relative items-start'>
                <div className='md:sticky top-10'>
                    <ProductGallery />
                </div>
                <div className=''>
                    <h1 className="text-[30px] lg:text-[40px] text-primary"> One Life Graphic Tshirt</h1>
                    <RatingStars rating={4} />
                    <div className='text-lg sm:text-[24px] font-satoshi-bold! flex items-center gap-4.5 my-3.5'>
                        <span className='text-primary'>$400</span>
                        {/* {product.oldPrice && ( */}
                        <span className='line-through text-[#B3B3B3]'>
                            $3200
                        </span>
                        {/* )} */}
                        {
                            // product.discount &&
                            <span className='bg-[#FF3333]/10 text-[#FF3333] py-2 px-3 text-[12px] font-satoshi-medium! rounded-full'>-23%</span>}
                    </div>
                    <p className='my-5'>
                        This graphic t-shirt which is perfect for any occasion. Crafted from a soft and breathable fabric, it offers superior comfort and style.
                        This graphic t-shirt which is perfect for any occasion. Crafted from a soft and breathable fabric, it offers superior comfort and style.
                        This graphic t-shirt which is perfect for any occasion. Crafted from a soft and breathable fabric, it offers superior comfort and style.
                        This graphic t-shirt which is perfect for any occasion. Crafted from a soft and breathable fabric, it offers superior comfort and style.
                        This graphic t-shirt which is perfect for any occasion. Crafted from a soft and breathable fabric, it offers superior comfort and style.
                        This graphic t-shirt which is perfect for any occasion. Crafted from a soft and breathable fabric, it offers superior comfort and style.
                        This graphic t-shirt which is perfect for any occasion. Crafted from a soft and breathable fabric, it offers superior comfort and style.
                        This graphic t-shirt which is perfect for any occasion. Crafted from a soft and breathable fabric, it offers superior comfort and style.
                        This graphic t-shirt which is perfect for any occasion. Crafted from a soft and breathable fabric, it offers superior comfort and style.
                        This graphic t-shirt which is perfect for any occasion. Crafted from a soft and breathable fabric, it offers superior comfort and style.
                        This graphic t-shirt which is perfect for any occasion. Crafted from a soft and breathable fabric, it offers superior comfort and style.
                        This graphic t-shirt which is perfect for any occasion. Crafted from a soft and breathable fabric, it offers superior comfort and style.
                        </p>
                    <div className='py-6 border-y border-border-color'>
                        Select Colors
                        <div className='flex mt-4 gap-3'>
                            {[
                                "#FF0000", // Red
                                "#00FF00", // Green
                                "#0000FF", // Blue
                                "#FFFF00"  // Yellow
                            ].map((color, id) => (
                                <label key={id} className={`w-8 h-8 rounded-full flex items-center justify-center text-secondary cursor-pointer`}
                                    style={{ background: color }}>
                                    <input type="radio" name="productColor" className="hidden" defaultChecked={id === 0} />
                                    {id === 0 && <IoCheckmarkOutline />}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className='py-6 border-b border-border-color'>
                        Choose Size
                        <div className='flex gap-2 mt-4 flex-wrap'>
                            {[
                                { label: "Small", value: "S" },
                                { label: "Medium", value: "M" },
                                { label: "Large", value: "L" },
                                { label: "X-Large", value: "XL" },
                            ].map((size) => {
                                const selectedValue = "L"; // default selected
                                return (
                                    <label key={size.value} className={`rounded-4xl px-6 py-3 block cursor-pointer ${size.value === selectedValue ? "bg-primary text-secondary" : "bg-tertiary"}`}>
                                        <input type="radio" name="productSize" value={size.value} className="hidden" defaultChecked={size.value === selectedValue} />
                                        {size.label}
                                    </label>
                                )
                            })}
                        </div>
                    </div>

                    <div className='py-6 flex gap-5'>
                        <div className='bg-tertiary w-fit py-3.5 px-5 rounded-4xl gap-3 flex items-center text-primary'>
                            <button >
                                <Minus />
                            </button>
                            <span>1</span>
                            <button >
                                <Plus />
                            </button>
                        </div>
                        <Button btnProps={{
                            text: "Add to Cart",
                            className: "flex-1",
                            variant: "black"
                        }} />
                    </div>
                </div>
            </div>
        </main >
    )
}

export default ProductDetailSection