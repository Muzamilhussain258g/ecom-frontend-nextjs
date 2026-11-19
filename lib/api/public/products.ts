import { cache } from "react"
import { redirect } from "next/navigation"
import { isApiError } from "../errors"
import type { ApiFetchOptions } from "../client"
import { apiFetch, apiFetchSafe } from "../client"
import type {
  ListProductsParams,
  ProductDetail,
  ProductListResult,
  ProductReviewsResult,
} from "@/types/api/product"

// Optional auth never writes cookies during Server Component rendering.
// Personalised product responses must not enter the shared data cache.
export async function listProducts(params: ListProductsParams = {}, guest = false) {
  return productRequest<ProductListResult>({
    path: "/products",
    query: { ...params, page: params.page ?? 1, limit: params.limit ?? 12,
      sortBy: params.sortBy ?? "createdAt", sortOrder: params.sortOrder ?? "desc" },
    auth: guest ? false : "optional",
    cache: "no-store",
  })
}

async function productRequest<T>(options: ApiFetchOptions): Promise<T> {
  try {
    return await apiFetch<T>(options)
  } catch (error) {
    if (isApiError(error) && error.status === 401) {
      redirect('/login?next=' + encodeURIComponent(options.path))
    }
    throw error
  }
}

export const getProductBySlug = cache(async (slug: string) => {
  return productRequest<ProductDetail>({
    path: '/products/' + encodeURIComponent(slug),
    auth: "optional",
    cache: "no-store",
  })
})

export async function getProductBySlugSafe(slug: string) {
  try {
    return await getProductBySlug(slug)
  } catch (error) {
    if (isApiError(error) && error.status === 404) return null
    throw error
  }
}

export async function getProductReviews(
  productId: number,
  params: { page?: number; limit?: number } = {},
) {
  return apiFetchSafe<ProductReviewsResult>(
    {
      path: `/products/${productId}/reviews`,
      query: {
        page: params.page ?? 1,
        limit: params.limit ?? 10,
      },
      revalidate: 60,
      tags: [`product-reviews:${productId}`],
    },
    { items: [], averageRating: 0, totalReviews: 0 },
  )
}
