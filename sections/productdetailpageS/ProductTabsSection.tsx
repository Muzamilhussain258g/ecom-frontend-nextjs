import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import Button from '@/components/Button';
import { BiAbacus } from 'react-icons/bi';
import { GiAbacus } from 'react-icons/gi';
import ReviewCard from '@/components/ReviewCard';


const ProductTabsSection = () => {
    const router = useRouter();

    const searchParams = useSearchParams()
    const pathname = usePathname();
    const activeTab = searchParams.get('tab') || 'rating-reviews';

    const [position, setPosition] = React.useState("bottom")
    const [open, setOpen] = useState(false);

    console.log
    return (
        <section className="py-10">
            <div className="container">
                <Tabs defaultValue={activeTab} onValueChange={(value) => {
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
                    <TabsContent value={'rating-reviews'} className={"w-full mt-6"}>
                        <div className='flex justify-between items-center'>
                            <h4 className='text-[20px] font-bold text-primary flex items-end gap-1'>All Reviews
                                <span className='text-[14px]! text-foreground mb-0.5'>(451)</span>
                            </h4>
                            <div className='flex gap-2.5 items-center'>
                                {/* Filters wala implement krdo  */}
                                <button className='p-4 rounded-full bg-tertiary text-primary'>
                                    <BiAbacus size={18} />
                                </button>
                                <DropdownMenu open={open} onOpenChange={setOpen} >
                                    <DropdownMenuTrigger render={<button className="flex items-center gap-2 rounded-full text-primary px-7 py-4 bg-tertiary">
                                        Latest
                                        <ChevronDown
                                            className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-180" : ""
                                                }`}
                                        />
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
                                <button className='text-secondary px-7 py-4 rounded-full bg-primary'>Write a review</button>
                                {/* <Button btnProps={{
                                text: "Write a review",
                                variant: "black",
                                className:"px-4"
                            }} /> */}
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-5 mt-6">
                            {[...Array(10)].map((it, i) => (
                                <ReviewCard
                                    key={i}
                                    review={"I absolutely love this t-shirt! The design is unique, the fabric feels premium, and the fit is perfect. I've already ordered another color.I absolutely love this t-shirt! The design is unique, the fabric feels premium, and the fit is perfect. I've already ordered another color.I absolutely love this t-shirt! The design is unique, the fabric feels premium, and the fit is perfect. I've already ordered another color.I absolutely love this t-shirt! The design is unique, the fabric feels premium, and the fit is perfect. I've already ordered another color.I absolutely love this t-shirt! The design is unique, the fabric feels premium, and the fit is perfect. I've already ordered another color."}
                                    rating={4}
                                    username={"Alex M."}
                                    dateOfReview='Posted on August 18, 2023'
                                />
                            ))}
                        </div>

                        <div className='text-center'>
                            <Button btnProps={{
                                text: "View More",
                                className: "mt-9"
                            }} />
                        </div>
                    </TabsContent>
                </Tabs>

            </div>
        </section>
    )
}

export default ProductTabsSection