"use client"

import { Heart } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { setWishlistActive, useWishlist } from "@/hooks/use-wishlist"
import { cn } from "@/lib/utils"
import { customerBrowserFetch } from "@/lib/api/browser"
import { ApiError } from "@/lib/api/errors"
import { toast } from "sonner"

interface WishlistButtonProps {
  productId: number
  initialActive?: boolean
  className?: string
  /** Larger control for product detail */
  size?: "sm" | "md"
  showLabel?: boolean
}

export default function WishlistButton({
  productId,
  initialActive = false,
  className,
  size = "sm",
  showLabel = false,
}: WishlistButtonProps) {
  const router = useRouter()
  const active = useWishlist(productId, initialActive)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  const toggle = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()

    startTransition(async () => {
      const nextActive = !active
      setErrorMessage(null)
      try {
        if (nextActive) {
          await customerBrowserFetch(`/wishlist/${productId}`, { method: "POST" })
        } else {
          await customerBrowserFetch(`/wishlist/${productId}`, { method: "DELETE" })
        }
        setWishlistActive(productId, nextActive)
        toast.success(nextActive ? "Added to wishlist." : "Removed from wishlist.")
      } catch (error) {
        setErrorMessage("Could not update wishlist. Please try again.")
        if (error instanceof ApiError && error.status === 401) {
          const next = encodeURIComponent(window.location.pathname + window.location.search)
          router.push(`/login?next=${next}`)
          toast.info("Please sign in to save products.")
          return
        }
        toast.error(error instanceof Error ? error.message : "Could not update wishlist.")
      }
    })
  }

  return (
    <button
      type="button"
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={active}
      title={errorMessage ?? (active ? "Remove from wishlist" : "Add to wishlist")}
      disabled={pending}
      onClick={toggle}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full transition-colors",
        size === "sm"
          ? "size-10 bg-white/95 text-primary shadow-sm hover:bg-white"
          : "h-12 px-5 bg-tertiary text-primary hover:bg-black/5",
        active && "text-[#ff3333]",
        size === "sm" && !active && "sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100 focus:opacity-100",
        pending && "opacity-70",
        className,
      )}
    >
      <Heart
        className={cn(size === "sm" ? "size-5" : "size-5")}
        fill={active ? "currentColor" : "none"}
        strokeWidth={1.8}
      />
      {showLabel && (
        <span className="text-sm font-medium">
          {active ? "Wishlisted" : "Add to Wishlist"}
        </span>
      )}
    </button>
  )
}
