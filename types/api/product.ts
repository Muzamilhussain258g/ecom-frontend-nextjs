import type {
  CategorySummary,
  PaginationMeta,
  ProductMedia,
  VariantValue,
} from "./common"

export interface ProductCategoryAssignment {
  isPrimary: boolean
  category: CategorySummary
}

export interface ProductListItem {
  id: number
  name: string
  slug: string
  description: string
  basePrice: string | number
  productStatus: boolean
  hasVariants: boolean
  createdAt?: string
  updatedAt?: string
  productCategories: ProductCategoryAssignment[]
  images: ProductMedia[]
}

export interface ProductListResult {
  products: ProductListItem[]
  meta: {
    pagination: PaginationMeta
  }
}

export interface ProductVariantOption {
  id: number
  name: string
  slug: string
  sortOrder?: number
  values: VariantValue[]
}

export interface ProductVariant {
  id: number
  sku: string
  price: string | number
  stock: number
  isActive: boolean
  combinationKey: string
  values: VariantValue[]
}

export interface ProductReviewPreview {
  id: number
  review: string
  stars: number
  user: { id: number; name: string }
}

export interface ProductDetail {
  id: number
  name: string
  slug: string
  description: string
  basePrice: string | number
  productStatus: boolean
  hasVariants: boolean
  createdAt?: string
  updatedAt?: string
  productCategories: ProductCategoryAssignment[]
  variantOptions: ProductVariantOption[]
  variants: ProductVariant[]
  images: ProductMedia[]
  reviews: {
    averageRating: number
    totalReviews: number
    items: ProductReviewPreview[]
  }
}

export interface ListProductsParams {
  page?: number
  limit?: number
  search?: string
  category?: string
  sortOrder?: "asc" | "desc"
}

export interface ProductReviewsResult {
  reviews?: ProductReviewPreview[]
  items?: ProductReviewPreview[]
  averageRating?: number
  totalReviews?: number
  summary?: {
    averageRating?: number
    totalReviews?: number
    breakdown?: Record<string, number>
  }
  meta?: {
    pagination?: PaginationMeta
  }
}
