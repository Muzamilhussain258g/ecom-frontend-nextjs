"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import * as addressesApi from "@/lib/api/customer/addresses"
import { isApiError } from "@/lib/api/errors"
import { hasAuthSession } from "@/lib/api/cookies"
import type { CreateAddressPayload } from "@/types/api/order"

export type AddressActionResult = {
  ok: boolean
  message?: string
}

export async function createAddressAction(
  _prev: AddressActionResult | undefined,
  formData: FormData,
): Promise<AddressActionResult> {
  if (!(await hasAuthSession())) {
    redirect("/login?next=/account/addresses")
  }

  const payload: CreateAddressPayload = {
    label: String(formData.get("label") || "home"),
    fullName: String(formData.get("fullName") || "").trim(),
    phone: String(formData.get("phone") || "").trim(),
    street: String(formData.get("street") || "").trim(),
    city: String(formData.get("city") || "").trim(),
    province: String(formData.get("province") || "").trim(),
    postalCode: String(formData.get("postalCode") || "").trim(),
    country: String(formData.get("country") || "").trim(),
    isDefault: formData.get("isDefault") === "on",
  }

  try {
    await addressesApi.createAddress(payload)
    revalidatePath("/account/addresses")
    revalidatePath("/checkout")
    return { ok: true, message: "Address saved." }
  } catch (error) {
    return {
      ok: false,
      message: isApiError(error) ? error.message : "Could not save address.",
    }
  }
}

export async function deleteAddressAction(id: number): Promise<AddressActionResult> {
  if (!(await hasAuthSession())) {
    redirect("/login?next=/account/addresses")
  }
  try {
    await addressesApi.deleteAddress(id)
    revalidatePath("/account/addresses")
    revalidatePath("/checkout")
    return { ok: true }
  } catch (error) {
    return {
      ok: false,
      message: isApiError(error) ? error.message : "Could not delete address.",
    }
  }
}
