"use client"
import React, { useState } from 'react'
import ProductCard from '../ProductCard'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { ChevronDown } from 'lucide-react'
export default function ProductsGrid() {
    const [sortOption, setSortOption] = useState("priceLow")
    const [open, setOpen] = useState(false);

    return (
        <div className='min-w-0 md:col-span-2 xl:col-span-3'>
            <div className='mb-5 flex flex-wrap items-end justify-between gap-x-4 gap-y-2'>
                <h2 className='text-[28px] leading-tight font-satoshi-bold! text-primary sm:text-[32px]'>Casual</h2>
                <div className='flex w-full min-w-0 items-center justify-between gap-2 text-sm sm:w-auto sm:justify-end sm:gap-4 sm:text-base'>
                    <div className='min-w-0 whitespace-nowrap text-black/60'>
                        Showing 1-10 of 100<span className='hidden sm:inline'> Products</span>
                    </div>
                    <div className='flex shrink-0 items-center whitespace-nowrap'>Sort by:
                        <DropdownMenu open={open} onOpenChange={setOpen}>
                            <DropdownMenuTrigger render={
                                <button className='ml-1 inline-flex items-center whitespace-nowrap font-bold text-primary'>
                                    {sortOption === "priceLow"
                                        ? "Low to High"
                                        : sortOption === "priceHigh"
                                            ? "High to Low"
                                            : "High to Low"}
                                    <ChevronDown className='size-4 sm:size-5' />
                                </button>
                            } />
                            <DropdownMenuContent className="w-32">
                                <DropdownMenuGroup>
                                    <DropdownMenuLabel>Sort Options</DropdownMenuLabel>
                                    <DropdownMenuRadioGroup value={sortOption} onValueChange={setSortOption}>

                                        <DropdownMenuRadioItem value="priceLow">Low to High</DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value="priceHigh">High to Low</DropdownMenuRadioItem>
                                    </DropdownMenuRadioGroup>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 gap-x-3 gap-y-6 min-[375px]:grid-cols-2 sm:gap-x-5 sm:gap-y-8 md:grid-cols-2 xl:grid-cols-3">
                {
                    [...Array(10)].map((el, i) => (
                        <ProductCard key={i} product={{
                            id: 1,
                            name: "One Life Graphic T-shirt",
                            image: "/images/shirt2.png",
                            rating: 4.5,
                            reviews: 451,
                            price: 260,
                            oldPrice: 300,
                            discount: "-40%",
                            category: "T-shirts",
                        }} />
                    ))
                }
            </div>

            <Pagination className='mt-10'>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious href="#" />
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink href="#">1</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink href="#" isActive>
                            2
                        </PaginationLink>
                    </PaginationItem>

                    <PaginationItem>
                        <PaginationEllipsis />
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink href="#" isActive>
                            20
                        </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationNext href="#" />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    )
}
