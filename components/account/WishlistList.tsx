"use client"

import Image from "next/image"
import Link from "next/link"
import { useTransition } from "react"
import type { WishlistActionResult } from "@/actions/wishlist"
import { notifyAction } from "@/lib/action-toast"

interface WishlistListProps {
  items: Array<{
    id: number
    productId: number
    name: string
    slug: string
    price: number
    image: string
  }>
  removeWishlistAction: (productId: number) => Promise<WishlistActionResult>
}

export function WishlistList({ items, removeWishlistAction }: WishlistListProps) {
  const [pending, startTransition] = useTransition()

  if (!items.length) {
    return <p className="mt-8 text-black/60">Your wishlist is empty.</p>
  }

  return (
    <div className="mt-8 grid gap-4">
      {items.map((item) => (
        <div key={item.id} className="flex gap-4 rounded-2xl border border-border-color p-4">
          <Image src={item.image} alt={item.name} width={96} height={96} className="rounded-xl" />
          <div className="flex flex-1 items-start justify-between gap-3">
            <div>
              {item.slug ? (
                <Link href={`/products/${item.slug}`} className="font-satoshi-bold text-primary">
                  {item.name}
                </Link>
              ) : (
                <p className="font-satoshi-bold text-primary">{item.name}</p>
              )}
              <p className="mt-1 text-primary">${item.price}</p>
            </div>
            <button
              type="button"
              disabled={pending}
              className="text-sm text-red-600"
              onClick={() =>
                startTransition(async () => {
                  await notifyAction(() => removeWishlistAction(item.productId), "Removed from wishlist.")
                })
              }
            >
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
