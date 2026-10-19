import AllProductsSection from '@/sections/allProductsS/AllProductsSection'
import { getCollectionBySlugSafe } from '@/lib/api/public/collections'
import { mapProductToCard } from '@/lib/api/mappers'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { ProductListItem } from '@/types/api/product'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const collection = await getCollectionBySlugSafe(slug)
  if (!collection) return { title: 'Collection not found' }
  return {
    title: collection.name,
    description: collection.description || `${collection.name} collection`,
    alternates: { canonical: `/collections/${collection.slug}` },
  }
}

export default async function CollectionPage({ params }: Props) {
  const { slug } = await params
  const collection = await getCollectionBySlugSafe(slug)
  if (!collection) notFound()

  const products = collection.products.map((entry) => {
    const product = entry.product as ProductListItem
    return mapProductToCard({
      ...product,
      images: 'images' in product ? product.images : [],
      productCategories: 'productCategories' in product ? product.productCategories : [],
    })
  })

  return (
    <AllProductsSection
      products={products}
      title={collection.name}
      total={products.length}
      page={1}
      totalPages={1}
      limit={products.length || 12}
      categorySlug={collection.slug}
    />
  )
}
