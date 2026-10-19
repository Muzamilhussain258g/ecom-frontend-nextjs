"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import * as wishlistApi from "@/lib/api/customer/wishlist"
import { isApiError } from "@/lib/api/errors"
import { hasAuthSession } from "@/lib/api/cookies"

export type WishlistActionResult = {
  ok: boolean
  message?: string
}

export async function addWishlistAction(productId: number): Promise<WishlistActionResult> {
  if (!(await hasAuthSession())) {
    redirect(`/login?next=/products`)
  }
  try {
    await wishlistApi.addToWishlist(productId)
    revalidatePath("/account/wishlist")
    return { ok: true, message: "Added to wishlist." }
  } catch (error) {
    return {
      ok: false,
      message: isApiError(error) ? error.message : "Could not update wishlist.",
    }
  }
}

export async function removeWishlistAction(productId: number): Promise<WishlistActionResult> {
  if (!(await hasAuthSession())) {
    redirect("/login?next=/account/wishlist")
  }
  try {
    await wishlistApi.removeFromWishlist(productId)
    revalidatePath("/account/wishlist")
    return { ok: true }
  } catch (error) {
    return {
      ok: false,
      message: isApiError(error) ? error.message : "Could not update wishlist.",
    }
  }
}
