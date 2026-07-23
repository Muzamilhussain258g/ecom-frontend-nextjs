"use client"
import Image from 'next/image';
import React from 'react'
// @ts-ignore
import ReactStars from 'react-stars'


export interface ProductCardData {
    id: number
    name: string
    image: string
    rating: number
    reviews: number
    price: number
    oldPrice: number | null
    discount: string | null
    category: "T-shirts" | "Jeans" | "Shirts"
}

export interface ProductCardProps {
    product: ProductCardData
}

const ProductCard = ({ product }: ProductCardProps) => {
    return (
        <div>
            <Image height={444} width={306} src={product.image} alt={product.name} className='w-full rounded-2xl' />
            <div className='mt-4'>
                <h3 className='text-primary text-md sm:text-[20px] font-satoshi-bold!'>{product.name}</h3>
                <div className=' flex items-center gap-2'>
                    <ReactStars
                        count={5}
                        size={24}
                        value={product.rating}
                        color2={'#ffd700'}
                        edit={false}

                    />
                    <span className='max-sm:text-sm'>
                        <span className='text-primary'>{product.rating} </span>
                        /5
                    </span>
                </div>
                <div className='text-lg sm:text-[24px] font-satoshi-bold! flex items-center gap-4.5'>
                    <span className='text-primary'>${product.price}</span>
                    {product.oldPrice && (
                        <span className='line-through'>
                            ${product.oldPrice}
                        </span>
                    )}
                    {product.discount && <span className='bg-[#FF3333]/10 text-[#FF3333] py-2 px-3 text-[12px] font-satoshi-medium! rounded-full'>{product.discount}</span>}
                </div>
            </div>
        </div>
    )
}

export default ProductCard