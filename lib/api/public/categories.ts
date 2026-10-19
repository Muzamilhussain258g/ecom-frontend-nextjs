import { apiFetchSafe } from "../client"
import type { CategoryListResult, CategoryNode } from "@/types/api/category"

export async function listCategories(params: {
  page?: number
  limit?: number
  depth?: number
  parentId?: number
} = {}) {
  return apiFetchSafe<CategoryListResult>(
    {
      path: "/categories",
      query: {
        page: params.page ?? 1,
        limit: params.limit ?? 20,
        depth: params.depth ?? 2,
        parentId: params.parentId,
      },
      revalidate: 120,
      tags: ["categories"],
    },
    {
      categories: [],
      meta: {
        parentId: null,
        depth: params.depth ?? 2,
        pagination: {
          page: 1,
          limit: params.limit ?? 20,
          total: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      },
    },
  )
}

export async function getCategoryById(id: number) {
  return apiFetchSafe<CategoryNode | null>(
    {
      path: `/categories/${id}`,
      revalidate: 120,
      tags: ["categories", `category:${id}`],
    },
    null,
  )
}
