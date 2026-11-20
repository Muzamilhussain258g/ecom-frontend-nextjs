"use client"

import { createContext, createElement, useContext, useState, type ReactNode } from "react"

type WishlistState = {
  authenticated: boolean
  changes: Map<number, boolean>
  setWishlistActive: (productId: number, active: boolean) => void
}
const WishlistContext = createContext<WishlistState | null>(null)

// The layout remounts this provider when the session changes. No user state
// survives logout/account switching and no wishlist collection fetch is needed.
export function WishlistProvider({ children, authenticated }: {
  children: ReactNode
  authenticated: boolean
}) {
  const [changes, setChanges] = useState(new Map<number, boolean>())
  const setWishlistActive = (productId: number, active: boolean) => {
    setChanges(previous => new Map(previous).set(productId, active))
  }
  return createElement(WishlistContext.Provider, {
    value: { authenticated, changes, setWishlistActive },
  }, children)
}

export function useWishlistState() {
  const state = useContext(WishlistContext)
  if (!state) throw new Error("WishlistProvider is required")
  return state
}

export function useWishlist(productId: number, initialActive?: boolean) {
  const { authenticated, changes } = useWishlistState()
  return authenticated && (changes.get(productId) ?? initialActive)
}
