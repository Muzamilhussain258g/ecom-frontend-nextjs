export interface Address {
  id: number
  label: string
  fullName: string
  phone: string
  street: string
  city: string
  province: string
  postalCode: string
  country: string
  isDefault: boolean
}

export interface CreateAddressPayload {
  label: string
  fullName: string
  phone: string
  street: string
  city: string
  province: string
  postalCode: string
  country: string
  isDefault?: boolean
}

export interface PlaceOrderPayload {
  shippingAddressId: number
  paymentGateway: "cod"
}

export interface Order {
  id: number
  status: string
  total?: number | string
  createdAt?: string
  updatedAt?: string
  [key: string]: unknown
}

export interface WishlistItem {
  id: number
  productId?: number
  product?: {
    id: number
    name: string
    slug: string
    basePrice: string | number
    images?: Array<{ media: { url: string } }>
  }
}
