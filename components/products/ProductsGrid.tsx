"use client"
import React from 'react'
import ProductCard, { ProductCardData } from '../ProductCard'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
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
import Filters from './Filters'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

interface ProductsGridProps {
    products: ProductCardData[]
    title?: string
    page?: number
    totalPages?: number
    total?: number
    limit?: number
}

export default function ProductsGrid({
    products,
    title = "Casual",
    page = 1,
    totalPages = 1,
    total = 0,
    limit = 12,
}: ProductsGridProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const sortOption = searchParams.get("sortOrder") === "desc" ? "priceHigh" : "priceLow"
    const [open, setOpen] = React.useState(false)

    const start = total === 0 ? 0 : (page - 1) * limit + 1
    const end = Math.min(page * limit, total)

    const setSort = (value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set("sortOrder", value === "priceHigh" ? "desc" : "asc")
        params.set("page", "1")
        router.push(`${pathname}?${params.toString()}`)
    }

    const pageHref = (p: number) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set("page", String(p))
        return `${pathname}?${params.toString()}`
    }

    const pagesToShow = Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
        if (totalPages <= 5) return i + 1
        if (page <= 3) return i + 1
        if (page >= totalPages - 2) return totalPages - 4 + i
        return page - 2 + i
    })

    return (
        <div className='min-w-0 md:col-span-2 xl:col-span-3'>
            <div className='mb-5 flex flex-wrap items-end justify-between gap-x-4 gap-y-2'>
                <h2 className='text-[28px] leading-tight font-satoshi-bold! text-primary sm:text-[32px]'>{title}</h2>
                <Filters variant="mobile" />
                <div className='max-sm:mt-2 flex w-full min-w-0 items-center justify-between gap-2 text-sm md:w-auto md:justify-end md:gap-4 md:text-base'>
                    <div className='min-w-0 whitespace-nowrap text-black/60'>
                        Showing {start}-{end} of {total}<span className='hidden sm:inline'> Products</span>
                    </div>
                    <div className='flex shrink-0 items-center whitespace-nowrap'>
                        <span className='hidden min-[375px]:inline'>Sort by:</span>
                        <DropdownMenu open={open} onOpenChange={setOpen}>
                            <DropdownMenuTrigger render={
                                <button className='ml-1 inline-flex items-center whitespace-nowrap font-bold text-primary'>
                                    {sortOption === "priceLow"
                                        ? "A to Z"
                                        : "Z to A"}
                                    <ChevronDown className='size-4 sm:size-5' />
                                </button>
                            } />
                            <DropdownMenuContent className="w-32">
                                <DropdownMenuGroup>
                                    <DropdownMenuLabel>Sort Options</DropdownMenuLabel>
                                    <DropdownMenuRadioGroup value={sortOption} onValueChange={setSort}>
                                        <DropdownMenuRadioItem value="priceLow">A to Z</DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value="priceHigh">Z to A</DropdownMenuRadioItem>
                                    </DropdownMenuRadioGroup>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 gap-x-3 gap-y-6 min-[375px]:grid-cols-2 sm:gap-x-5 sm:gap-y-8 md:grid-cols-2 xl:grid-cols-3">
                {products.length === 0 ? (
                    <p className="col-span-full text-black/60">No products found.</p>
                ) : (
                    products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))
                )}
            </div>

            {totalPages > 1 && (
                <Pagination className='mt-10'>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious href={page > 1 ? pageHref(page - 1) : "#"} />
                        </PaginationItem>
                        {pagesToShow[0] > 1 && (
                            <PaginationItem>
                                <PaginationEllipsis />
                            </PaginationItem>
                        )}
                        {pagesToShow.map((p) => (
                            <PaginationItem key={p}>
                                <PaginationLink href={pageHref(p)} isActive={p === page}>
                                    {p}
                                </PaginationLink>
                            </PaginationItem>
                        ))}
                        {pagesToShow[pagesToShow.length - 1] < totalPages && (
                            <PaginationItem>
                                <PaginationEllipsis />
                            </PaginationItem>
                        )}
                        <PaginationItem>
                            <PaginationNext href={page < totalPages ? pageHref(page + 1) : "#"} />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}
        </div>
    )
}
