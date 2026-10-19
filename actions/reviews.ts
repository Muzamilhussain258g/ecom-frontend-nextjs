"use server"

import { revalidatePath, revalidateTag } from "next/cache"
import { redirect } from "next/navigation"
import { apiFetch } from "@/lib/api/client"
import { isApiError } from "@/lib/api/errors"
import { hasAuthSession } from "@/lib/api/cookies"

export type ReviewActionResult = {
  ok: boolean
  message?: string
}

export async function submitReviewAction(
  _prev: ReviewActionResult | undefined,
  formData: FormData,
): Promise<ReviewActionResult> {
  if (!(await hasAuthSession())) {
    redirect("/login")
  }

  const productId = Number(formData.get("productId"))
  const slug = String(formData.get("slug") || "")
  const stars = Number(formData.get("stars") || 5)
  const review = String(formData.get("review") || "").trim()

  if (!productId || !review) {
    return { ok: false, message: "Review text is required." }
  }

  try {
    await apiFetch({
      path: `/products/${productId}/reviews`,
      method: "POST",
      body: { stars, review },
      auth: true,
      cache: "no-store",
    })
    if (slug) {
      revalidatePath(`/products/${slug}`)
      revalidateTag(`product:${slug}`, "max")
      revalidateTag(`product-reviews:${productId}`, "max")
    }
    return { ok: true, message: "Review submitted." }
  } catch (error) {
    return {
      ok: false,
      message: isApiError(error) ? error.message : "Could not submit review.",
    }
  }
}
