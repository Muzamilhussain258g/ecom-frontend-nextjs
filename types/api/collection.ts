import type { MediaAsset } from "./common"
import type { ProductListItem } from "./product"

export interface CollectionProduct {
  id: number
  position: number
  product: ProductListItem | {
    id: number
    name: string
    slug: string
    description: string
    basePrice: string | number
    productStatus: boolean
    hasVariants: boolean
  }
}

export interface Collection {
  id: number
  name: string
  slug: string
  description?: string | null
  isActive: boolean
  media?: {
    media: MediaAsset
    altText?: string | null
  } | null
  products: CollectionProduct[]
  createdAt?: string
  updatedAt?: string
}
