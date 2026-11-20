"use client"

import Button from '@/components/Button'
import ProductGallery from '@/components/productDetailC/ProductGallery'
import RatingStars from '@/components/RatingStars'
import WishlistButton from '@/components/WishlistButton'
import { Minus, Plus } from 'lucide-react'
import React, { useEffect, useMemo, useState, useTransition } from 'react'
import { IoCheckmarkOutline } from 'react-icons/io5'
import type { ProductDetail } from '@/types/api/product'
import {
    findMatchingVariant,
    getProductGalleryImages,
    getProductVariantGroups,
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

    const images = getProductGalleryImages(product)
    const variantGroups = useMemo(() => getProductVariantGroups(product), [product])

    const getInitialSelections = () => {
        const initial: Record<number, number> = {}

        // 1. Prioritize values from the first active, in-stock variant or first variant
        const defaultVariant =
            product.variants.find((v) => v.isActive && v.stock > 0) ||
            product.variants[0]

        if (defaultVariant?.values) {
          for (const v of defaultVariant.values) {
            const typeId = v.variantType?.id
            if (typeId) {
              initial[typeId] = v.id
            }
          }
        }

        // 2. Fall back to the first value for any remaining groups
        for (const group of variantGroups) {
          if (initial[group.id] === undefined && group.values.length > 0) {
            initial[group.id] = group.values[0].id
          }
        }

        return initial
    }

    const [selectedOptions, setSelectedOptions] = useState<Record<number, number>>(getInitialSelections)

    useEffect(() => {
        setSelectedOptions(getInitialSelections())
        setQty(1)
        setMessage(null)
    }, [product.id, variantGroups])

    const handleSelectOption = (groupId: number, valueId: number) => {
        setSelectedOptions((prev) => ({
            ...prev,
            [groupId]: valueId,
        }))
        setMessage(null)
    }

    const selectedVariant = useMemo(() => {
        return findMatchingVariant(product.variants, selectedOptions)
    }, [product.variants, selectedOptions])

    const price = Number(selectedVariant?.price ?? product.basePrice)
    const isOutOfStock = selectedVariant ? selectedVariant.stock <= 0 || !selectedVariant.isActive : false
    const isUnavailable = !selectedVariant && (product.hasVariants || product.variants.length > 0)
    const canAddToCart = !isOutOfStock && !isUnavailable && (product.variants.length === 0 || !!selectedVariant)
    const maxQty = selectedVariant?.stock ? Math.min(selectedVariant.stock, 99) : 99

    const onAddToCart = () => {
        if (!selectedVariant) {
            setMessage("No purchasable variant available.")
            toast.error("No purchasable variant available.")
            return
        }
        if (isOutOfStock) {
            setMessage("This variant is currently out of stock.")
            toast.error("This variant is currently out of stock.")
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
                        {selectedVariant?.stock !== undefined && (
                            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                                isOutOfStock
                                    ? "bg-red-100 text-red-700"
                                    : "bg-emerald-100 text-emerald-800"
                            }`}>
                                {isOutOfStock ? "Out of Stock" : "In Stock"}
                            </span>
                        )}
                    </div>
                    <p className='my-5 whitespace-pre-line text-neutral-600'>
                        {product.description}
                    </p>

                    {variantGroups.map((group) => {
                        const selectedValueId = selectedOptions[group.id]
                        const selectedVal = group.values.find((v) => v.id === selectedValueId)

                        return (
                            <div key={group.id} className='py-5 border-t border-border-color'>
                                <div className='flex items-center justify-between'>
                                    <span className='text-sm sm:text-base font-medium text-primary'>
                                        {group.displayTitle}
                                    </span>
                                    {selectedVal && (
                                        <span className='text-sm text-neutral-500 font-normal'>
                                            {selectedVal.label}
                                        </span>
                                    )}
                                </div>

                                {group.isColor ? (
                                    <div className='flex mt-3.5 gap-3 flex-wrap items-center'>
                                        {group.values.map((color) => {
                                            const isSelected = selectedValueId === color.id
                                            return (
                                                <button
                                                    key={color.id}
                                                    type="button"
                                                    title={color.label}
                                                    aria-label={`${group.name}: ${color.label}`}
                                                    aria-pressed={isSelected}
                                                    onClick={() => handleSelectOption(group.id, color.id)}
                                                    className={`w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-transform ${
                                                        isSelected
                                                            ? "ring-2 ring-primary ring-offset-2 scale-105"
                                                            : "hover:scale-105 border border-black/10"
                                                    } ${color.isLight ? "border border-neutral-300" : ""}`}
                                                    style={{ backgroundColor: color.hex || "#111" }}
                                                >
                                                    {isSelected && (
                                                        <IoCheckmarkOutline
                                                            className={`text-lg stroke-2 ${
                                                                color.isLight ? "text-black" : "text-white"
                                                            }`}
                                                        />
                                                    )}
                                                </button>
                                            )
                                        })}
                                    </div>
                                ) : (
                                    <div className='flex gap-2.5 mt-3.5 flex-wrap'>
                                        {group.values.map((val) => {
                                            const isSelected = selectedValueId === val.id
                                            return (
                                                <button
                                                    key={val.id}
                                                    type="button"
                                                    aria-label={`${group.name}: ${val.label}`}
                                                    aria-pressed={isSelected}
                                                    onClick={() => handleSelectOption(group.id, val.id)}
                                                    className={`rounded-4xl px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-medium transition-colors cursor-pointer ${
                                                        isSelected
                                                            ? "bg-primary text-secondary shadow-sm"
                                                            : "bg-tertiary text-primary hover:bg-neutral-200"
                                                    }`}
                                                >
                                                    {val.label}
                                                </button>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>
                        )
                    })}

                    {isUnavailable && (
                        <p className="text-sm text-amber-600 font-medium my-3">
                            This combination is currently unavailable. Please select different options.
                        </p>
                    )}

                    {selectedVariant && selectedVariant.stock > 0 && selectedVariant.stock <= 5 && (
                        <p className="text-xs text-amber-700 font-medium my-2">
                            Only {selectedVariant.stock} left in stock - order soon!
                        </p>
                    )}

                    <div className='py-6 border-t border-border-color flex flex-wrap gap-3 sm:gap-5'>
                        <div className='bg-tertiary w-fit py-3.5 px-5 rounded-4xl gap-3 flex items-center text-primary'>
                            <button
                                type="button"
                                onClick={() => setQty((q) => Math.max(1, q - 1))}
                                aria-label="Decrease quantity"
                                disabled={qty <= 1}
                                className="cursor-pointer disabled:opacity-40"
                            >
                                <Minus />
                            </button>
                            <span className="min-w-[1.5rem] text-center">{qty}</span>
                            <button
                                type="button"
                                onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
                                aria-label="Increase quantity"
                                disabled={qty >= maxQty}
                                className="cursor-pointer disabled:opacity-40"
                            >
                                <Plus />
                            </button>
                        </div>
                        <Button btnProps={{
                            text: pending
                                ? "Adding..."
                                : isOutOfStock
                                    ? "Out of Stock"
                                    : isUnavailable
                                        ? "Unavailable"
                                        : "Add to Cart",
                            disabled: pending || !canAddToCart,
                            className: "flex-1 min-w-[140px]",
                            variant: "black",
                            onClick: onAddToCart,
                        }} />
                        <WishlistButton initialActive={product.isWishlisted}
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
