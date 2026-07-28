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
        <div className='md:col-span-2 xl:col-span-3'>
            <div className='flex justify-between'>
                <h2 className='text-[32px] font-satoshi-bold! text-primary'>Casual</h2>
                <div className='flex gap-4'>
                    <div>Showing 1-10 of 100 Products</div>
                    <div >Sort by:
                        <DropdownMenu open={open} onOpenChange={setOpen}>
                            <DropdownMenuTrigger render={
                                <button className='text-primary ml-1 font-bold inline-flex'>
                                    {sortOption === "priceLow"
                                        ? "Low to High"
                                        : sortOption === "priceHigh"
                                            ? "High to Low"
                                            : "High to Low"}
                                    <ChevronDown />
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
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-x-5 gap-y-8">
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
