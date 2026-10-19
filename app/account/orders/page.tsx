"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { customerBrowserFetch } from "@/lib/api/browser"
import type { Order } from "@/types/api/order"
import { Skeleton } from "@/components/ui/skeleton"

function normalizeOrders(data: { orders?: Order[]; data?: Order[] } | Order[]): Order[] {
  if (Array.isArray(data)) return data
  if (data && typeof data === "object") {
    if (Array.isArray(data.orders)) return data.orders
    if (Array.isArray(data.data)) return data.data
  }
  return []
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const data = await customerBrowserFetch<{ orders?: Order[]; data?: Order[] } | Order[]>(
          "/orders",
          { query: { page: 1, limit: 20 } },
        )
        if (!cancelled) setOrders(normalizeOrders(data))
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load orders")
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  if (loading) {
    return (
      <div className="grid max-w-3xl gap-4">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-24 w-full" />
      </div>
    )
  }

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>
  }

  return (
    <div className="w-full max-w-3xl text-left">
      <h1 className="font-integral-bold text-left text-[32px] text-primary">Orders</h1>
      <div className="mt-8 grid gap-4">
        {orders.length === 0 ? (
          <p className="text-black/60">No orders yet.</p>
        ) : (
          orders.map((order) => (
            <Link
              key={order.id}
              href={`/account/orders/${order.id}`}
              className="rounded-2xl border border-border-color p-5 transition hover:bg-tertiary"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-satoshi-bold text-primary">Order #{order.id}</p>
                  <p className="text-sm text-black/60">
                    {order.createdAt
                      ? new Date(String(order.createdAt)).toLocaleString()
                      : "—"}
                  </p>
                </div>
                <span className="rounded-full bg-tertiary px-3 py-1 text-sm capitalize">
                  {String(order.status || "pending")}
                </span>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
