"use client"

import React, { useTransition } from 'react'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import Link from 'next/link'
import Heading from '@/components/Heading'
import Image from 'next/image'
import { ArrowRight, Minus, Plus } from 'lucide-react'
import { PiTrashFill } from 'react-icons/pi'
import { RiCoupon2Line } from 'react-icons/ri'
import Button from '@/components/Button'
import { customerBrowserFetch } from '@/lib/api/browser'
import type { Cart } from '@/types/api/cart'

export interface CartLineItem {
    id: number
    name: string
    slug: string
    image: string
    price: number
    quantity: number
    sizeLabel: string
    colorLabel: string
}

export interface CartSummaryView {
    subtotal: number
    discount: number
    deliveryFee: number
    total: number
}

interface CartSectionProps {
    items: CartLineItem[]
    summary: CartSummaryView
    onChanged?: () => void | Promise<void>
}

export default function CartSection({ items, summary, onChanged }: CartSectionProps) {
    const [pending, startTransition] = useTransition()

    const changeQty = (itemId: number, quantity: number) => {
        if (quantity < 1) return
        startTransition(async () => {
            await customerBrowserFetch<Cart>(`/cart/items/${itemId}`, {
                method: "PATCH",
                body: { buyingQuantity: quantity },
            })
            await onChanged?.()
        })
    }

    const removeItem = (itemId: number) => {
        startTransition(async () => {
            await customerBrowserFetch<Cart>(`/cart/items/${itemId}`, {
                method: "DELETE",
            })
            await onChanged?.()
        })
    }

    return (
        <section className='py-2'>
            <div className="w-full">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink render={<Link href="/">Home</Link>} />
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink render={<Link href="/account">Account</Link>} />
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage className=" text-primary">Cart</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <Heading text='Your cart' className='!text-left py-6' />
                <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-5 items-start relative">
                    <div className="xl:col-span-2 px-6  border rounded-2xl">
                        {items.length === 0 ? (
                            <p className="py-10 text-black/60">Your cart is empty.</p>
                        ) : (
                            items.map((item) => (
                                <div className='flex gap-4 border-b py-6' key={item.id}>
                                    <Link href={`/products/${item.slug}`}>
                                        <Image src={item.image}
                                            className='w-30'
                                            width={400}
                                            height={400}
                                            alt={item.name}
                                        />
                                    </Link>
                                    <div className='flex-1'>
                                        <div className='flex justify-between max-sm:gap-3'>
                                            <h3 className='sm:text-[20px] font-satoshi-bold text-primary'>{item.name}</h3>
                                            <button
                                                type="button"
                                                disabled={pending}
                                                onClick={() => removeItem(item.id)}
                                                aria-label={`Remove ${item.name}`}
                                            >
                                                <PiTrashFill size={24} className='text-[#ff3333]' />
                                            </button>
                                        </div>
                                        <div className='mt-1 text-sm'>
                                            <span className='text-primary'>Size:</span>
                                            {" "}{item.sizeLabel || "-"}
                                        </div>
                                        <div className='text-sm'>
                                            <span className='text-primary'>Color:</span>
                                            {" "}{item.colorLabel || "-"}
                                        </div>
                                        <div className='mt-4 flex justify-between items-center'>
                                            <h3 className='text-lg sm:text-[24px] font-satoshi-bold text-primary'>${item.price}</h3>
                                            <div className='bg-tertiary w-fit py-2 sm:py-3.5 px-3 sm:px-5 rounded-4xl gap-3 flex items-center text-primary'>
                                                <button
                                                    type="button"
                                                    disabled={pending}
                                                    onClick={() => changeQty(item.id, item.quantity - 1)}
                                                >
                                                    <Minus className="w-4 h-4 sm:w-5 sm:h-5" />
                                                </button>
                                                <span>{item.quantity}</span>
                                                <button
                                                    type="button"
                                                    disabled={pending}
                                                    onClick={() => changeQty(item.id, item.quantity + 1)}
                                                >
                                                    <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                                                </button>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    <div className="sticky top-10 border rounded-2xl py-5 px-6">
                        <h3 className='text-[24px] font-satoshi-bold text-primary'>Order Summary</h3>
                        <div className='grid gap-5 mt-6 pb-6 border-b'>
                            <div className='flex text-[20px] justify-between'>
                                <span className=''>Subtotal</span> <span className='text-primary'>${summary.subtotal}</span>
                            </div>
                            <div className='flex text-[20px] justify-between'>
                                <span className=''>Discount</span> <span className='text-primary'>-${summary.discount}</span>
                            </div>
                            <div className='flex text-[20px] justify-between '>
                                <span className=''>Delivery Fee</span> <span className='text-primary'>${summary.deliveryFee}</span>
                            </div>
                        </div>
                        <div>
                            <div className='flex text-[20px] justify-between pt-6'>
                                <span className='text-primary'>Total</span> <span className='text-primary'>${summary.total}</span>
                            </div>
                            <div className='flex py-6 gap-2 flex-wrap'>
                                <div className='flex-1 flex items-center gap-1 bg-tertiary py-3 px-4 rounded-full'>
                                    <RiCoupon2Line size={24} />
                                    <input type="text" placeholder='Add promo code' className='outline-none border-none w-full' />
                                </div>
                                <Button btnProps={{
                                    text: "Apply",
                                    variant: "black",
                                }} />
                            </div>
                            <Link href="/checkout" className="block">
                                <Button btnProps={{
                                    text: "Go to Checkout",
                                    icon: <ArrowRight />,
                                    variant: "black",
                                    className: "w-full",
                                }} />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
