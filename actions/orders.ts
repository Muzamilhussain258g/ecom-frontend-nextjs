"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import * as ordersApi from "@/lib/api/customer/orders"
import { isApiError } from "@/lib/api/errors"
import { hasAuthSession } from "@/lib/api/cookies"

export type OrderActionResult = {
  ok: boolean
  message?: string
  orderId?: number
}

export async function placeOrderAction(
  _prev: OrderActionResult | undefined,
  formData: FormData,
): Promise<OrderActionResult> {
  if (!(await hasAuthSession())) {
    redirect("/login?next=/checkout")
  }

  const shippingAddressId = Number(formData.get("shippingAddressId"))
  if (!shippingAddressId) {
    return { ok: false, message: "Select a shipping address." }
  }

  try {
    const order = await ordersApi.placeOrder({
      shippingAddressId,
      paymentGateway: "cod",
    })
    revalidatePath("/cart")
    revalidatePath("/account/orders")
    return { ok: true, orderId: order.id, message: "Order placed successfully." }
  } catch (error) {
    if (typeof error === "object" && error && "digest" in error) {
      throw error
    }
    return {
      ok: false,
      message: isApiError(error) ? error.message : "Checkout failed.",
    }
  }
}

export async function cancelOrderAction(orderId: number): Promise<OrderActionResult> {
  if (!(await hasAuthSession())) {
    redirect("/login?next=/account/orders")
  }
  try {
    await ordersApi.cancelOrder(orderId)
    revalidatePath("/account/orders")
    revalidatePath(`/account/orders/${orderId}`)
    return { ok: true, message: "Order cancelled." }
  } catch (error) {
    return {
      ok: false,
      message: isApiError(error) ? error.message : "Cancel failed.",
    }
  }
}
