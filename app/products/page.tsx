import AllProductsSection from '@/sections/allProductsS/AllProductsSection'
import { listProducts } from '@/lib/api/public/products'
import { mapProductToCard } from '@/lib/api/mappers'
import type { Metadata } from 'next'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Products',
  description: 'Browse the SHOP.CO product catalog with search, filters, and sorting.',
}

type SearchParams = Promise<{
  page?: string
  search?: string
  category?: string
  sortOrder?: string
  limit?: string
}>

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const params = await searchParams
  const page = Number(params.page || 1) || 1
  const limit = Number(params.limit || 12) || 12
  const sortOrder = params.sortOrder === 'desc' ? 'desc' : 'asc'

  const result = await listProducts({
    page,
    limit,
    search: params.search,
    category: params.category,
    sortOrder,
  })

  const products = result.products.map(mapProductToCard)
  const title = params.category
    ? params.category.replace(/-/g, ' ')
    : params.search
      ? `Search: ${params.search}`
      : 'Casual'

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
