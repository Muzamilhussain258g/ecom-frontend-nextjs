"use client"

import { toast } from "sonner"

type ActionResult = { ok: boolean; message?: string }

/** Notify at the action boundary, even if a refresh unmounts the caller. */
export async function notifyAction<T extends ActionResult>(
  action: () => Promise<T>,
  successMessage: string,
  errorMessage = "Something went wrong. Please try again.",
): Promise<T> {
  let result: T
  try {
    result = await action()
  } catch (error) {
    // Next.js redirects are control flow, not failed user actions.
    const isRedirect = typeof error === "object" && error && "digest" in error
      && typeof error.digest === "string" && error.digest.startsWith("NEXT_REDIRECT;")
    if (!isRedirect) {
      toast.error(error instanceof Error ? error.message : errorMessage)
    }
    throw error
  }
  if (result.ok) toast.success(result.message || successMessage)
  else toast.error(result.message || errorMessage)
  return result
}
