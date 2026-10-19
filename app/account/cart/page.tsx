"use client"

import { useCallback, useEffect, useState } from "react"
import CartSection from "@/sections/cartS/CartSection"
import { customerBrowserFetch } from "@/lib/api/browser"
import { mapCartItemForUi, mapCartSummary } from "@/lib/api/mappers"
import type { Cart } from "@/types/api/cart"
import { Skeleton } from "@/components/ui/skeleton"

export default function AccountCartPage() {
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadCart = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await customerBrowserFetch<Cart>("/cart")
      setCart(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load cart")
      setCart(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadCart()
  }, [loadCart])

  if (loading) {
    return (
      <div className="grid gap-4">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-72 w-full" />
      </div>
    )
  }

  if (error || !cart) {
    return <p className="text-sm text-red-600">{error || "Unable to load cart."}</p>
  }

  const items = cart.items.map((item) => {
    const mapped = mapCartItemForUi(item)
    return {
      id: mapped.id,
      name: mapped.name,
      slug: mapped.slug,
      image: mapped.image,
      price: mapped.price,
      quantity: mapped.quantity,
      sizeLabel: mapped.sizeLabel,
      colorLabel: mapped.colorLabel,
    }
  })
  const summary = mapCartSummary(cart)

  return (
    <CartSection
      items={items}
      summary={{
        subtotal: summary.subtotal,
        discount: summary.discount,
        deliveryFee: summary.deliveryFee,
        total: summary.total,
      }}
      onChanged={loadCart}
    />
  )
}
