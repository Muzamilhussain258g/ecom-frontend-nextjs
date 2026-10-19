import { apiFetch } from "../client"
import type {
  AddToCartPayload,
  Cart,
  UpdateCartItemPayload,
} from "@/types/api/cart"

export function getCart() {
  return apiFetch<Cart>({
    path: "/cart",
    auth: true,
    cache: "no-store",
  })
}

export function addCartItem(payload: AddToCartPayload) {
  return apiFetch<Cart>({
    path: "/cart/items",
    method: "POST",
    body: payload,
    auth: true,
    cache: "no-store",
  })
}

export function updateCartItem(itemId: number, payload: UpdateCartItemPayload) {
  return apiFetch<Cart>({
    path: `/cart/items/${itemId}`,
    method: "PATCH",
    body: payload,
    auth: true,
    cache: "no-store",
  })
}

export function removeCartItem(itemId: number) {
  return apiFetch<Cart>({
    path: `/cart/items/${itemId}`,
    method: "DELETE",
    auth: true,
    cache: "no-store",
  })
}

export function clearCart() {
  return apiFetch<Cart>({
    path: "/cart/clear",
    method: "DELETE",
    auth: true,
    cache: "no-store",
  })
}
