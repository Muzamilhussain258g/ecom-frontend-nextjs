import type { MediaAsset, PaginationMeta } from "./common"

export interface CategoryNode {
  id: number
  categoryName: string
  slug: string
  parentId: number | null
  media?: {
    media: MediaAsset
    altText?: string | null
  } | null
  children?: CategoryNode[]
}

export interface CategoryListResult {
  categories: CategoryNode[]
  meta: {
    parentId: number | null
    depth: number
    pagination: PaginationMeta
  }
}
