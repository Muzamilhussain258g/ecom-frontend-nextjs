"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import * as cartApi from "@/lib/api/customer/cart"
import { isApiError } from "@/lib/api/errors"
import { hasAuthSession } from "@/lib/api/cookies"

export type CartActionResult = {
  ok: boolean
  message?: string
}

async function requireAuth(next = "/account/cart") {
  if (!(await hasAuthSession())) {
    redirect(`/login?next=${encodeURIComponent(next)}`)
  }
}

export async function addToCartAction(input: {
  variantId: number
  buyingQuantity?: number
}): Promise<CartActionResult> {
  await requireAuth("/account/cart")
  try {
    await cartApi.addCartItem({
      variantId: input.variantId,
      buyingQuantity: input.buyingQuantity ?? 1,
      isSelected: true,
    })
    revalidatePath("/account/cart")
    return { ok: true, message: "Added to cart." }
  } catch (error) {
    return {
      ok: false,
      message: isApiError(error) ? error.message : "Could not add to cart.",
    }
  }
}

export async function updateCartItemAction(input: {
  itemId: number
  buyingQuantity?: number
  isSelected?: boolean
}): Promise<CartActionResult> {
  await requireAuth("/account/cart")
  try {
    await cartApi.updateCartItem(input.itemId, {
      buyingQuantity: input.buyingQuantity,
      isSelected: input.isSelected,
    })
    revalidatePath("/account/cart")
    return { ok: true }
  } catch (error) {
    return {
      ok: false,
      message: isApiError(error) ? error.message : "Could not update cart.",
    }
  }
}

export async function removeCartItemAction(itemId: number): Promise<CartActionResult> {
  await requireAuth("/account/cart")
  try {
    await cartApi.removeCartItem(itemId)
    revalidatePath("/account/cart")
    return { ok: true }
  } catch (error) {
    return {
      ok: false,
      message: isApiError(error) ? error.message : "Could not remove item.",
    }
  }
}

export async function clearCartAction(): Promise<CartActionResult> {
  await requireAuth("/account/cart")
  try {
    await cartApi.clearCart()
    revalidatePath("/account/cart")
    return { ok: true }
  } catch (error) {
    return {
      ok: false,
      message: isApiError(error) ? error.message : "Could not clear cart.",
    }
  }
}
