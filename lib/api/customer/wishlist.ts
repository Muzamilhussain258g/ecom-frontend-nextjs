import { apiFetch } from "../client"
import type { WishlistItem } from "@/types/api/order"

export function getWishlist(params: { page?: number; limit?: number } = {}) {
  return apiFetch<{ items?: WishlistItem[] } | WishlistItem[]>({
    path: "/wishlist",
    query: {
      page: params.page ?? 1,
      limit: params.limit ?? 20,
    },
    auth: true,
    cache: "no-store",
  })
}

export function addToWishlist(productId: number) {
  return apiFetch<unknown>({
    path: `/wishlist/${productId}`,
    method: "POST",
    auth: true,
    cache: "no-store",
  })
}

export function removeFromWishlist(productId: number) {
  return apiFetch<unknown>({
    path: `/wishlist/${productId}`,
    method: "DELETE",
    auth: true,
    cache: "no-store",
  })
}
