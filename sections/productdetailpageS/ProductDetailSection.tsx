"use client"

import Button from '@/components/Button'
import ProductGallery from '@/components/productDetailC/ProductGallery'
import RatingStars from '@/components/RatingStars'
import WishlistButton from '@/components/WishlistButton'
import { Minus, Plus } from 'lucide-react'
import React, { useMemo, useState, useTransition } from 'react'
import { IoCheckmarkOutline } from 'react-icons/io5'
import type { ProductDetail } from '@/types/api/product'
import {
    getColorOptions,
    getProductGalleryImages,
    getSizeOptions,
} from '@/lib/api/mappers'
import { addToCartAction } from '@/actions/cart'
import { useRouter } from 'next/navigation'
import { notifyAction } from '@/lib/action-toast'
import { toast } from 'sonner'

interface ProductDetailSectionProps {
    product: ProductDetail
}

function ProductDetailSection({ product }: ProductDetailSectionProps) {
    const router = useRouter()
    const [pending, startTransition] = useTransition()
    const [message, setMessage] = useState<string | null>(null)
    const [qty, setQty] = useState(1)

    const colors = getColorOptions(product)
    const sizes = getSizeOptions(product)
    const images = getProductGalleryImages(product)

    const [selectedColorId, setSelectedColorId] = useState<number | null>(
        colors[0]?.id ?? null,
    )
    const [selectedSizeId, setSelectedSizeId] = useState<number | null>(
        sizes[0]?.id ?? null,
    )

    const selectedVariant = useMemo(() => {
        if (!product.variants.length) return null

        const neededIds = [selectedColorId, selectedSizeId].filter(
            (id): id is number => typeof id === "number",
        )

        if (!neededIds.length) return product.variants[0]

        const match = product.variants.find((variant) => {
            const ids = variant.values.map((v) => v.id)
            return neededIds.every((id) => ids.includes(id))
        })

        return match || product.variants[0]
    }, [product.variants, selectedColorId, selectedSizeId])

    const price = Number(selectedVariant?.price ?? product.basePrice)

    const onAddToCart = () => {
        if (!selectedVariant) {
            setMessage("No purchasable variant available.")
            toast.error("No purchasable variant available.")
            return
        }
        startTransition(async () => {
            const result = await notifyAction(() => addToCartAction({
                variantId: selectedVariant.id,
                buyingQuantity: qty,
            }), "Added to cart.")
            if (result.ok) {
                setMessage("Added to cart")
                router.refresh()
            } else {
                setMessage(result.message || "Could not add to cart")
            }
        })
    }

    return (
        <main className="py-10">
            <div className='container grid md:grid-cols-2 md:gap-5 lg:gap-10 relative items-start'>
                <div className='md:sticky top-10'>
                    <ProductGallery images={images} alt={product.name} />
                </div>
                <div className=''>
                    <h1 className="text-[30px] lg:text-[40px] text-primary">{product.name}</h1>
                    <RatingStars rating={product.reviews.averageRating || 0} />
                    <div className='text-lg sm:text-[24px] font-satoshi-bold! flex items-center gap-4.5 my-3.5'>
                        <span className='text-primary'>${price}</span>
                    </div>
                    <p className='my-5 whitespace-pre-line'>
                        {product.description}
                    </p>

                    {colors.length > 0 && (
                        <div className='py-6 border-y border-border-color'>
                            Select Colors
                            <div className='flex mt-4 gap-3 flex-wrap'>
                                {colors.map((color) => (
                                    <label
                                        key={color.id}
                                        className={`w-8 h-8 rounded-full flex items-center justify-center text-secondary cursor-pointer border border-black/10`}
                                        style={{ background: color.hex || "#111" }}
                                    >
                                        <input
                                            type="radio"
                                            name="productColor"
                                            className="hidden"
                                            checked={selectedColorId === color.id}
                                            onChange={() => setSelectedColorId(color.id)}
                                        />
                                        {selectedColorId === color.id && <IoCheckmarkOutline />}
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {sizes.length > 0 && (
                        <div className='py-6 border-b border-border-color'>
                            Choose Size
                            <div className='flex gap-2 mt-4 flex-wrap'>
                                {sizes.map((size) => (
                                    <label
                                        key={size.id}
                                        className={`rounded-4xl px-6 py-3 block cursor-pointer ${
                                            selectedSizeId === size.id
                                                ? "bg-primary text-secondary"
                                                : "bg-tertiary"
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="productSize"
                                            value={size.code}
                                            className="hidden"
                                            checked={selectedSizeId === size.id}
                                            onChange={() => setSelectedSizeId(size.id)}
                                        />
                                        {size.label}
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className='py-6 flex flex-wrap gap-3 sm:gap-5'>
                        <div className='bg-tertiary w-fit py-3.5 px-5 rounded-4xl gap-3 flex items-center text-primary'>
                            <button
                                type="button"
                                onClick={() => setQty((q) => Math.max(1, q - 1))}
                                aria-label="Decrease quantity"
                            >
                                <Minus />
                            </button>
                            <span>{qty}</span>
                            <button
                                type="button"
                                onClick={() => setQty((q) => q + 1)}
                                aria-label="Increase quantity"
                            >
                                <Plus />
                            </button>
                        </div>
                        <Button btnProps={{
                            text: pending ? "Adding..." : "Add to Cart",
                            disabled: pending,
                            className: "flex-1 min-w-[140px]",
                            variant: "black",
                            onClick: onAddToCart,
                        }} />
                        <WishlistButton
                            productId={product.id}
                            size="md"
                            showLabel
                            className="max-sm:w-full"
                        />
                    </div>
                    {message && (
                        <p className="text-sm text-primary/80">{message}</p>
                    )}
                </div>
            </div>
        </main >
    )
}

export default ProductDetailSection
