"use client"
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import RatingStars from './RatingStars';
import WishlistButton from './WishlistButton';

export interface ProductCardData {
    id: number
    name: string
    slug?: string
    image: string
    rating: number
    reviews: number
    price: number
    oldPrice: number | null
    discount: string | null
    category: string
}

export interface ProductCardProps {
    product: ProductCardData
}

const ProductCard = ({ product }: ProductCardProps) => {
    const href = product.slug ? `/products/${product.slug}` : undefined

    const content = (
        <div className="group">
            <div className="relative overflow-hidden rounded-2xl">
                <Image
                    height={444}
                    width={306}
                    src={product.image}
                    alt={product.name}
                    className="w-full rounded-2xl"
                />
                <div className="absolute top-3 right-3 z-10 opacity-100 transition-opacity duration-200 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
                    <WishlistButton productId={product.id} />
                </div>
            </div>
            <div className="mt-4">
                <h3 className="text-primary text-md sm:text-[20px] font-satoshi-bold!">{product.name}</h3>
                <div className="flex items-center gap-2">
                    <RatingStars rating={product.rating} />
                    <span className="max-sm:text-sm">
                        <span className="text-primary">{product.rating} </span>
                        /5
                    </span>
                </div>
                <div className="text-lg sm:text-[24px] font-satoshi-bold! flex items-center gap-4.5">
                    <span className="text-primary">${product.price}</span>
                    {product.oldPrice && (
                        <span className="line-through text-[#B3B3B3]">
                            ${product.oldPrice}
                        </span>
                    )}
                    {product.discount && (
                        <span className="bg-[#FF3333]/10 text-[#FF3333] py-2 px-3 text-[12px] font-satoshi-medium! rounded-full">
                            {product.discount}
                        </span>
                    )}
                </div>
            </div>
        </div>
    )

    if (href) {
        return (
            <Link href={href} className="block">
                {content}
            </Link>
        )
    }

    return content
}

export default ProductCard
