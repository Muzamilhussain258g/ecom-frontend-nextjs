import type { ApiEnvelope } from "@/types/api/common"
import { ApiError } from "./errors"

type QueryValue = string | number | boolean | undefined | null

export async function customerBrowserFetch<T>(
  path: string,
  options: {
    method?: string
    query?: Record<string, QueryValue>
    body?: unknown
  } = {},
): Promise<T> {
  const normalized = path.startsWith("/") ? path : `/${path}`
  const url = new URL(`/api/customer${normalized}`, window.location.origin)

  if (options.query) {
    for (const [key, value] of Object.entries(options.query)) {
      if (value === undefined || value === null || value === "") continue
      url.searchParams.set(key, String(value))
    }
  }

  const res = await fetch(url.toString(), {
    method: options.method || "GET",
    credentials: "include",
    headers:
      options.body === undefined
        ? { Accept: "application/json" }
        : {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    cache: "no-store",
  })

  const text = await res.text()
  let payload: ApiEnvelope<T> | null = null
  if (text) {
    try {
      payload = JSON.parse(text) as ApiEnvelope<T>
    } catch {
      throw new ApiError("Invalid JSON response", res.status, { path })
    }
  }

  if (!res.ok) {
    throw new ApiError(payload?.message || res.statusText || "Request failed", res.status, {
      path,
      details: payload,
    })
  }

  if (payload && "data" in payload) return payload.data
  return payload as unknown as T
}
