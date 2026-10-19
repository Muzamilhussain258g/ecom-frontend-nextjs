import { apiFetch } from "../client"
import type { Order, PlaceOrderPayload } from "@/types/api/order"

export function placeOrder(payload: PlaceOrderPayload) {
  return apiFetch<Order>({
    path: "/orders",
    method: "POST",
    body: payload,
    auth: true,
    cache: "no-store",
  })
}

export function listOrders(params: { page?: number; limit?: number; status?: string } = {}) {
  return apiFetch<{ orders?: Order[]; data?: Order[] } | Order[]>({
    path: "/orders",
    query: {
      page: params.page ?? 1,
      limit: params.limit ?? 10,
      status: params.status,
    },
    auth: true,
    cache: "no-store",
  })
}

export function getOrder(id: number) {
  return apiFetch<Order>({
    path: `/orders/${id}`,
    auth: true,
    cache: "no-store",
  })
}

export function cancelOrder(id: number) {
  return apiFetch<Order>({
    path: `/orders/${id}/cancel`,
    method: "PATCH",
    auth: true,
    cache: "no-store",
  })
}
