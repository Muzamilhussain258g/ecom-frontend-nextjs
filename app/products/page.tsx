import Link from "next/link"
import { parseProductQuery } from "@/lib/api/product-query"
import { isApiError } from "@/lib/api/errors"
import type { ListProductsParams, ProductListResult } from "@/types/api/product"
import AllProductsSection from '@/sections/allProductsS/AllProductsSection'
import { listProducts } from '@/lib/api/public/products'
import { mapProductToCard } from '@/lib/api/mappers'
import type { Metadata } from 'next'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Products',
  description: 'Browse the SHOP.CO product catalog with search, filters, and sorting.',
}

type SearchParams = Promise<Record<string, string | string[] | undefined>>

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const rawParams = await searchParams
  let params: ListProductsParams
  let result: ProductListResult
  try {
    params = parseProductQuery(rawParams)
    result = await listProducts(params)
  } catch (error) {
    if (!isApiError(error) || error.status !== 400) throw error
    return <div className="container py-12" role="alert">
      <h1 className="text-2xl font-bold">Check your product filters</h1>
      <p className="my-4">{error.message}</p>
      <Link className="underline" href="/products">Reset filters</Link>
    </div>
  }

  const products = result.products.map(mapProductToCard)
  const title = params.category
    ? params.category.replace(/-/g, ' ')
    : params.search
      ? `Search: ${params.search}`
      : 'Products'

  return (
    <Suspense fallback={<div className="container py-10">Loading products...</div>}>
      <AllProductsSection
        products={products}
        title={title}
        page={result.meta.pagination.page}
        totalPages={result.meta.pagination.totalPages}
        total={result.meta.pagination.total}
        limit={result.meta.pagination.limit}
        categorySlug={params.category}
      />
    </Suspense>
  )
}
