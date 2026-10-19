import Slidder from '@/components/Slidder'
import CategorySection from '@/sections/homepageS/CategorySection'
import HeroSection from '@/sections/homepageS/HeroSection'
import NewArrivalSection from '@/sections/homepageS/NewArrivalSection'
import ReviewsSection from '@/sections/homepageS/ReviewsSection'
import TopSellingSection from '@/sections/homepageS/TopSellingSection'
import { listCategories } from '@/lib/api/public/categories'
import { listProducts } from '@/lib/api/public/products'
import { mapCategoryToBrowseItem, mapProductToCard } from '@/lib/api/mappers'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Home',
  description: 'SHOP.CO — discover new arrivals, top selling styles, and curated collections.',
}

export default async function HomePage() {
  const [newArrivals, topSelling, categoriesResult] = await Promise.all([
    listProducts({ page: 1, limit: 8, sortOrder: 'asc' }),
    listProducts({ page: 1, limit: 8, sortOrder: 'desc' }),
    listCategories({ page: 1, limit: 8, depth: 1 }),
  ])

  const newArrivalCards = newArrivals.products.map(mapProductToCard)
  const topSellingCards = topSelling.products.map(mapProductToCard)
  const categories = categoriesResult.categories.map(mapCategoryToBrowseItem)

  return (
    <>
      <HeroSection />
      <Slidder />
      <NewArrivalSection products={newArrivalCards} />
      <TopSellingSection products={topSellingCards} />
      <CategorySection categories={categories} />
      <ReviewsSection />
    </>
  )
}
