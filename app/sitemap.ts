import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/api/config"
import { listProducts } from "@/lib/api/public/products"
import { listCollections } from "@/lib/api/public/collections"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    {
      url: `${SITE_URL}/products`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ]

  const [productsResult, collections] = await Promise.all([
    listProducts({ page: 1, limit: 100 }),
    listCollections(),
  ])

  const productRoutes = productsResult.products.map((product) => ({
    url: `${SITE_URL}/products/${product.slug}`,
    lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  const collectionRoutes = collections.map((collection) => ({
    url: `${SITE_URL}/collections/${collection.slug}`,
    lastModified: collection.updatedAt ? new Date(collection.updatedAt) : new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }))

  return [...staticRoutes, ...productRoutes, ...collectionRoutes]
}
