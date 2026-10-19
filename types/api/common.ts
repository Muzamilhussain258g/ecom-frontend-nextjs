export interface ApiEnvelope<T> {
  success: boolean
  method?: string
  statusCode: number
  message: string
  path?: string
  timestamp?: string
  data: T
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export interface MediaAsset {
  id: number
  providerPublicId?: string
  url: string
  format?: string | null
  bytes?: number | null
  width?: number | null
  height?: number | null
}

export interface ProductMedia {
  id: number
  isPrimary: boolean
  position: number
  altText?: string | null
  media: MediaAsset
  variantValue?: VariantValue | null
}

export interface VariantTypeRef {
  id: number
  name: string
  slug: string
  sortOrder?: number
}

export interface VariantValue {
  id: number
  value: string
  code: string
  metadata?: Record<string, unknown> | null
  sortOrder?: number
  variantType?: VariantTypeRef
  productVariantValueId?: number
}

export interface CategorySummary {
  id: number
  categoryName: string
  slug: string
  parentId?: number | null
}
