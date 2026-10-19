"use client"

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useActionState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronDown, Sliders } from 'lucide-react';
import Button from '@/components/Button';
import ReviewCard from '@/components/ReviewCard';
import type { ReviewCardProps } from '@/components/ReviewCard'
import { submitReviewAction, type ReviewActionResult } from '@/actions/reviews'

interface ProductTabsSectionProps {
    productId: number
    productSlug: string
    description: string
    reviews: ReviewCardProps[]
    totalReviews?: number
}

const ProductTabsSection = ({
    productId,
    productSlug,
    description,
    reviews,
    totalReviews = 0,
}: ProductTabsSectionProps) => {
    const router = useRouter();
    const searchParams = useSearchParams()
    const pathname = usePathname();
    const activeTab = searchParams.get('tab') || 'rating-reviews';

    const [position, setPosition] = React.useState("bottom")
    const [open, setOpen] = useState(false);
    const [showForm, setShowForm] = useState(false)
    const [state, formAction, pending] = useActionState<ReviewActionResult | undefined, FormData>(
        submitReviewAction,
        undefined,
    )

    return (
        <section className="py-10">
            <div className="container">
                <Tabs value={activeTab} onValueChange={(value) => {
                    const params = new URLSearchParams(searchParams.toString());
                    params.set("tab", value);
                    router.replace(`${pathname}?${params.toString()}`, {
                        scroll: false,
                    })
                }}>
                    <TabsList variant="line" className="w-full">
                        <TabsTrigger value="details" className="data-active:text-primary data-active:after:bg-primary md:text-lg">
                            Product Details
                        </TabsTrigger>
                        <TabsTrigger value="rating-reviews" className="data-active:text-primary data-active:after:bg-primary md:text-lg">
                            Rating & Reviews
                        </TabsTrigger>
                        <TabsTrigger value="faqs" className="data-active:text-primary data-active:after:bg-primary md:text-lg">
                            FAQs
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="details" className="w-full mt-6">
                        <p className="text-primary/80 whitespace-pre-line">{description}</p>
                    </TabsContent>

                    <TabsContent value={'rating-reviews'} className={"w-full mt-6"}>
                        <div className='flex justify-between items-center flex-wrap'>
                            <h4 className='text-[20px] font-bold text-primary flex items-end gap-1'>All Reviews
                                <span className='text-[14px]! text-foreground mb-0.5'>({totalReviews})</span>
                            </h4>
                            <div className='flex gap-1 sm:gap-2.5 items-center'>
                                <DropdownMenu open={open} onOpenChange={setOpen} >
                                    <DropdownMenuTrigger render={<button className="flex items-center rounded-full text-primary bg-tertiary p-3">
                                        <span className="hidden md:flex items-center gap-2">
                                            Latest
                                            <ChevronDown
                                                className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-180" : ""
                                                    }`}
                                            />
                                        </span>
                                        <Sliders className="md:hidden h-5 w-5" />
                                    </button>
                                    } />
                                    <DropdownMenuContent className="w-32"
                                        side="bottom"
                                    >
                                        <DropdownMenuGroup>
                                            <DropdownMenuLabel>Panel Position</DropdownMenuLabel>
                                            <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
                                                <DropdownMenuRadioItem value="top">Top</DropdownMenuRadioItem>
                                                <DropdownMenuRadioItem value="bottom">Bottom</DropdownMenuRadioItem>
                                                <DropdownMenuRadioItem value="right">Right</DropdownMenuRadioItem>
                                            </DropdownMenuRadioGroup>
                                        </DropdownMenuGroup>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <button
                                    type="button"
                                    className='text-secondary px-7 py-4 rounded-full bg-primary'
                                    onClick={() => setShowForm((v) => !v)}
                                >
                                    Write a review
                                </button>
                            </div>
                        </div>

                        {showForm && (
                            <form action={formAction} className="mt-6 grid gap-3 rounded-2xl border border-border-color p-5">
                                <input type="hidden" name="productId" value={productId} />
                                <input type="hidden" name="slug" value={productSlug} />
                                <label className="text-sm text-primary">
                                    Stars
                                    <select name="stars" defaultValue="5" className="mt-1 block w-full rounded-xl border border-border-color bg-tertiary px-3 py-2">
                                        {[5, 4, 3, 2, 1].map((s) => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                </label>
                                <label className="text-sm text-primary">
                                    Review
                                    <textarea
                                        name="review"
                                        required
                                        rows={4}
                                        className="mt-1 w-full rounded-xl border border-border-color bg-tertiary px-3 py-2 outline-none"
                                        placeholder="Share your experience"
                                    />
                                </label>
                                {state?.message && (
                                    <p className={`text-sm ${state.ok ? "text-green-700" : "text-red-600"}`}>
                                        {state.message}
                                    </p>
                                )}
                                <Button btnProps={{
                                    text: pending ? "Submitting..." : "Submit review",
                                    variant: "black",
                                    className: "w-fit",
                                }} />
                            </form>
                        )}

                        <div className="grid md:grid-cols-2 gap-5 mt-6">
                            {reviews.length === 0 ? (
                                <p className="text-black/60">No reviews yet.</p>
                            ) : (
                                reviews.map((it, i) => (
                                    <ReviewCard
                                        key={`${it.username}-${i}`}
                                        review={it.review}
                                        rating={it.rating}
                                        username={it.username}
                                        dateOfReview={it.dateOfReview}
                                    />
                                ))
                            )}
                        </div>

                        <div className='text-center'>
                            <Button btnProps={{
                                text: "View More",
                                className: "mt-9"
                            }} />
                        </div>
                    </TabsContent>

                    <TabsContent value="faqs" className="w-full mt-6">
                        <p className="text-black/60">Frequently asked questions coming soon.</p>
                    </TabsContent>
                </Tabs>

            </div>
        </section>
    )
}

export default ProductTabsSection
