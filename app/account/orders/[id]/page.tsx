"use client"

import { useCallback, useEffect, useState, use } from "react"
import Link from "next/link"
import { customerBrowserFetch } from "@/lib/api/browser"
import type { Order } from "@/types/api/order"
import { CancelOrderButton } from "@/components/account/CancelOrderButton"
import { Skeleton } from "@/components/ui/skeleton"
import type { OrderActionResult } from "@/actions/orders"

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const orderId = Number(id)
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!orderId) {
      setError("Invalid order")
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const data = await customerBrowserFetch<Order>(`/orders/${orderId}`)
      setOrder(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load order")
    } finally {
      setLoading(false)
    }
  }, [orderId])

  useEffect(() => {
    void load()
  }, [load])

  const cancelOrderAction = async (idToCancel: number): Promise<OrderActionResult> => {
    try {
      await customerBrowserFetch(`/orders/${idToCancel}/cancel`, { method: "PATCH" })
      await load()
      return { ok: true, message: "Order cancelled." }
    } catch (err) {
      return {
        ok: false,
        message: err instanceof Error ? err.message : "Cancel failed.",
      }
    }
  }

  if (loading) {
    return (
      <div className="grid max-w-3xl gap-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-40 w-full" />
      </div>
    )
  }

  if (error || !order) {
    return <p className="text-sm text-red-600">{error || "Order not found."}</p>
  }

  return (
    <div className="w-full max-w-3xl text-left">
      <Link href="/account/orders" className="text-sm text-black/60 underline">
        Back to orders
      </Link>
      <h1 className="mt-4 font-integral-bold text-[32px] text-primary">
        Order #{order.id}
      </h1>
      <div className="mt-6 rounded-2xl border border-border-color p-6">
        <p className="text-primary">
          Status:{" "}
          <span className="capitalize font-satoshi-bold">{String(order.status)}</span>
        </p>
        {order.createdAt && (
          <p className="mt-2 text-sm text-black/60">
            Placed {new Date(String(order.createdAt)).toLocaleString()}
          </p>
        )}
        {String(order.status).toLowerCase() === "pending" && (
          <div className="mt-6">
            <CancelOrderButton orderId={order.id} cancelOrderAction={cancelOrderAction} />
          </div>
        )}
      </div>
    </div>
  )
}
