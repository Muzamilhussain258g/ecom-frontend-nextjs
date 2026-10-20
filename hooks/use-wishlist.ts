"use client"

import { useEffect, useSyncExternalStore } from "react"
import { usePathname } from "next/navigation"
import { customerBrowserFetch } from "@/lib/api/browser"
import type { WishlistItem } from "@/types/api/order"

let productIds = new Set<number>()
let loaded = false
let request: Promise<void> | null = null
const listeners = new Set<() => void>()
const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => { listeners.delete(listener) }
}

export function setWishlistActive(productId: number, active: boolean) {
  productIds = new Set(productIds)
  if (active) productIds.add(productId)
  else productIds.delete(productId)
  listeners.forEach((listener) => listener())
}

function loadWishlist() {
  if (request) return request
  request = (async () => {
    const ids = new Set<number>()
    const limit = 50
    for (let page = 1; ; page++) {
      const data = await customerBrowserFetch<WishlistItem[] | { items?: WishlistItem[] }>(
        "/wishlist", { query: { page, limit } },
      )
      const items = Array.isArray(data) ? data : data.items ?? []
      const previousSize = ids.size
      for (const item of items) {
        const id = item.product?.id ?? item.productId
        if (id !== undefined) ids.add(id)
      }
      if (Array.isArray(data) || items.length < limit || ids.size === previousSize) break
    }
    productIds = ids
    loaded = true
    listeners.forEach((listener) => listener())
  })().catch(() => {
    // Guests can still click a heart to enter the existing login flow.
    productIds = new Set()
    loaded = true
    listeners.forEach((listener) => listener())
  }).finally(() => { request = null })
  return request
}

export function useWishlist(productId: number, initialActive = false) {
  const pathname = usePathname()
  const active = useSyncExternalStore(
    subscribe,
    () => loaded ? productIds.has(productId) : initialActive,
    () => initialActive,
  )
  useEffect(() => { void loadWishlist() }, [pathname])
  return active
}
