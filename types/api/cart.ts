import type { MediaAsset } from "./common"

export interface CartItem {
  id: number
  cartId: number
  variantId: number
  isSelected: boolean
  buyingQuantity: number
  itemTotal: number
  variant: {
    id: number
    sku: string
    price: string | number
    stock: number
    isActive: boolean
    combinationKey: string
    product: {
      id: number
      name: string
      slug: string
      productStatus: boolean
      images: Array<{
        id: number
        altText?: string | null
        media: MediaAsset
      }>
    }
  }
}

export interface Cart {
  id: number
  userId: number
  items: CartItem[]
  summary: {
    totalItems: number
    selectedItemsCount: number
    subtotal: number
  }
}

export interface AddToCartPayload {
  variantId: number
  buyingQuantity?: number
  isSelected?: boolean
}

export interface UpdateCartItemPayload {
  buyingQuantity?: number
  isSelected?: boolean
}
