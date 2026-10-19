import type { ApiEnvelope } from "@/types/api/common"
import { API_BASE_URL, getDefaultHeaders } from "./config"
import {
  clearAuthCookies,
  getAccessToken,
  getRefreshSession,
  setAuthCookies,
} from "./cookies"
import { ApiError } from "./errors"

type QueryValue = string | number | boolean | undefined | null

export interface ApiFetchOptions {
  path: string
  method?: string
  query?: Record<string, QueryValue>
  body?: unknown
  auth?: boolean
  cache?: RequestCache
  revalidate?: number | false
  tags?: string[]
  headers?: HeadersInit
  /** Avoid infinite refresh loop */
  _retried?: boolean
}

function buildUrl(path: string, query?: Record<string, QueryValue>) {
  const normalized = path.startsWith("/") ? path : `/${path}`
  const url = new URL(`${API_BASE_URL}${normalized}`)

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === null || value === "") continue
      url.searchParams.set(key, String(value))
    }
  }

  return url.toString()
}

async function tryRefreshTokens(): Promise<boolean> {
  const { refreshToken, refreshTokenId } = await getRefreshSession()
  if (!refreshToken || !refreshTokenId) return false

  try {
    const res = await fetch(buildUrl("/auth/refresh"), {
      method: "POST",
      headers: {
        ...getDefaultHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken, refreshTokenId }),
      cache: "no-store",
    })

    if (!res.ok) {
      await clearAuthCookies()
      return false
    }

    const json = (await res.json()) as ApiEnvelope<{
      newAccessToken?: string
      accessToken?: string
    }>

    const accessToken = json.data?.newAccessToken || json.data?.accessToken
    if (!accessToken || !refreshToken || !refreshTokenId) {
      await clearAuthCookies()
      return false
    }

    await setAuthCookies({
      accessToken,
      refreshToken,
      refreshTokenId,
    })
    return true
  } catch {
    await clearAuthCookies()
    return false
  }
}

export async function apiFetch<T>(options: ApiFetchOptions): Promise<T> {
  const {
    path,
    method = "GET",
    query,
    body,
    auth = false,
    cache,
    revalidate,
    tags,
    headers: extraHeaders,
    _retried = false,
  } = options

  const headers = new Headers({
    ...getDefaultHeaders(),
    ...extraHeaders,
  })

  if (body !== undefined) {
    headers.set("Content-Type", "application/json")
  }

  if (auth) {
    const token = await getAccessToken()
    if (token) headers.set("Authorization", `Bearer ${token}`)
  }

  const nextOptions: { revalidate?: number | false; tags?: string[] } = {}
  if (revalidate !== undefined) nextOptions.revalidate = revalidate
  if (tags?.length) nextOptions.tags = tags

  const res = await fetch(buildUrl(path, query), {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: cache ?? (auth ? "no-store" : undefined),
    ...(Object.keys(nextOptions).length
      ? { next: nextOptions }
      : {}),
  })

  if (res.status === 401 && auth && !_retried) {
    const refreshed = await tryRefreshTokens()
    if (refreshed) {
      return apiFetch<T>({ ...options, _retried: true })
    }
  }

  let payload: ApiEnvelope<T> | null = null
  const text = await res.text()
  if (text) {
    try {
      payload = JSON.parse(text) as ApiEnvelope<T>
    } catch {
      throw new ApiError("Invalid JSON response from API", res.status, {
        path,
        details: text.slice(0, 300),
      })
    }
  }

  if (!res.ok) {
    throw new ApiError(
      payload?.message || res.statusText || "Request failed",
      res.status,
      { path, details: payload },
    )
  }

  if (payload && "data" in payload) {
    return payload.data
  }

  return payload as unknown as T
}

export async function apiFetchSafe<T>(
  options: ApiFetchOptions,
  fallback: T,
): Promise<T> {
  try {
    return await apiFetch<T>(options)
  } catch {
    return fallback
  }
}
