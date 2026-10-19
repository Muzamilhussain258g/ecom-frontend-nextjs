import { apiFetch, apiFetchSafe } from "../client"
import type {
  ListProductsParams,
  ProductDetail,
  ProductListResult,
  ProductReviewsResult,
} from "@/types/api/product"

export async function listProducts(params: ListProductsParams = {}) {
  return apiFetchSafe<ProductListResult>(
    {
      path: "/products",
      query: {
        page: params.page ?? 1,
        limit: params.limit ?? 12,
        search: params.search,
        category: params.category,
        sortOrder: params.sortOrder,
      },
      revalidate: 60,
      tags: ["products"],
    },
    {
      products: [],
      meta: {
        pagination: {
          page: params.page ?? 1,
          limit: params.limit ?? 12,
          total: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      },
    },
  )
}

export async function getProductBySlug(slug: string) {
  return apiFetch<ProductDetail>({
    path: `/products/${slug}`,
    revalidate: 60,
    tags: ["products", `product:${slug}`],
  })
}

export async function getProductBySlugSafe(slug: string) {
  try {
    return await getProductBySlug(slug)
  } catch {
    return null
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
