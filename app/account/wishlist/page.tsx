"use client"

import { useCallback, useEffect, useState } from "react"
import { customerBrowserFetch } from "@/lib/api/browser"
import { resolveMediaUrl } from "@/lib/api/mappers"
import type { WishlistItem } from "@/types/api/order"
import { WishlistList } from "@/components/account/WishlistList"
import { Skeleton } from "@/components/ui/skeleton"
import type { WishlistActionResult } from "@/actions/wishlist"

function normalizeWishlist(data: { items?: WishlistItem[] } | WishlistItem[]): WishlistItem[] {
  if (Array.isArray(data)) return data
  if (data && typeof data === "object" && Array.isArray(data.items)) return data.items
  return []
}

export default function WishlistPage() {
  const [items, setItems] = useState<
    Array<{
      id: number
      productId: number
      name: string
      slug: string
      price: number
      image: string
    }>
  >([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await customerBrowserFetch<{ items?: WishlistItem[] } | WishlistItem[]>(
        "/wishlist",
        { query: { page: 1, limit: 50 } },
      )
      const normalized = normalizeWishlist(data).map((item) => ({
        id: item.id,
        productId: item.product?.id || item.productId || item.id,
        name: item.product?.name || "Product",
        slug: item.product?.slug || "",
        price: Number(item.product?.basePrice || 0),
        image: resolveMediaUrl(item.product?.images?.[0]?.media?.url),
      }))
      setItems(normalized)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load wishlist")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const removeWishlistAction = async (productId: number): Promise<WishlistActionResult> => {
    try {
      await customerBrowserFetch(`/wishlist/${productId}`, { method: "DELETE" })
      await load()
      return { ok: true }
    } catch (err) {
      return {
        ok: false,
        message: err instanceof Error ? err.message : "Could not update wishlist.",
      }
    }
  }

  if (loading) {
    return (
      <div className="grid max-w-3xl gap-4">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-28 w-full" />
      </div>
    )
  }

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>
  }

  return (
    <div className="w-full max-w-3xl text-left">
      <h1 className="font-integral-bold text-left text-[32px] text-primary">Wishlist</h1>
      <WishlistList items={items} removeWishlistAction={removeWishlistAction} />
    </div>
  )
}
