import ProductDetailSection from '@/sections/productdetailpageS/ProductDetailSection'
import ProductTabsSection from '@/sections/productdetailpageS/ProductTabsSection'
import RelatedProductsSection from '@/sections/productdetailpageS/RelatedProductsSection'
import { getProductBySlugSafe, listProducts } from '@/lib/api/public/products'
import { mapProductToCard, mapReviewToCard, resolveMediaUrl } from '@/lib/api/mappers'
import { SITE_URL } from '@/lib/api/config'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlugSafe(slug)
  if (!product) {
    return { title: 'Product not found' }
  }

  const image = resolveMediaUrl(product.images?.[0]?.media?.url)

  return {
    title: product.name,
    description: product.description?.slice(0, 160),
    alternates: {
      canonical: `/products/${product.slug}`,
    },
    openGraph: {
      title: product.name,
      description: product.description?.slice(0, 160),
      url: `${SITE_URL}/products/${product.slug}`,
      images: [{ url: image }],
      type: 'website',
    },
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params
  const product = await getProductBySlugSafe(slug)
  if (!product) notFound()

  const related = await listProducts({ page: 1, limit: 8 })
  const relatedCards = related.products
    .filter((p) => p.id !== product.id)
    .slice(0, 4)
    .map(mapProductToCard)

  const reviewCards = (product.reviews.items || []).map(mapReviewToCard)
  const image = resolveMediaUrl(product.images?.[0]?.media?.url)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image,
    sku: product.variants[0]?.sku,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'USD',
      price: Number(product.basePrice),
      availability: product.variants.some((v) => v.stock > 0)
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url: `${SITE_URL}/products/${product.slug}`,
    },
    aggregateRating: product.reviews.totalReviews
      ? {
          '@type': 'AggregateRating',
          ratingValue: product.reviews.averageRating,
          reviewCount: product.reviews.totalReviews,
        }
      : undefined,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailSection product={product} />
      <Suspense fallback={null}>
        <ProductTabsSection
          productId={product.id}
          productSlug={product.slug}
          description={product.description}
          reviews={reviewCards}
          totalReviews={product.reviews.totalReviews}
        />
      </Suspense>
      <RelatedProductsSection products={relatedCards} />
    </>
  )
}
