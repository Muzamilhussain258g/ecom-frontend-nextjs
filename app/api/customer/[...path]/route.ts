import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import { API_BASE_URL, AUTH_COOKIE, getDefaultHeaders } from "@/lib/api/config"

type RouteContext = { params: Promise<{ path: string[] }> }

async function refreshAccessToken(jar: Awaited<ReturnType<typeof cookies>>) {
  const refreshToken = jar.get(AUTH_COOKIE.refreshToken)?.value
  const refreshTokenId = jar.get(AUTH_COOKIE.refreshTokenId)?.value
  if (!refreshToken || !refreshTokenId) return null

  const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: {
      ...getDefaultHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken, refreshTokenId }),
    cache: "no-store",
  })

  if (!res.ok) return null

  const json = await res.json()
  const accessToken = json?.data?.newAccessToken || json?.data?.accessToken
  if (!accessToken) return null

  jar.set(AUTH_COOKIE.accessToken, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 15,
  })

  return accessToken as string
}

async function proxy(request: NextRequest, context: RouteContext) {
  const { path } = await context.params
  const targetPath = path.join("/")
  const url = new URL(`${API_BASE_URL}/${targetPath}`)
  request.nextUrl.searchParams.forEach((value, key) => {
    url.searchParams.set(key, value)
  })

  const jar = await cookies()
  let accessToken = jar.get(AUTH_COOKIE.accessToken)?.value

  const forward = async (token?: string) => {
    const headers = new Headers(getDefaultHeaders())
    const contentType = request.headers.get("content-type")
    if (contentType) headers.set("Content-Type", contentType)
    if (token) headers.set("Authorization", `Bearer ${token}`)

    const hasBody = !["GET", "HEAD"].includes(request.method)
    const body = hasBody ? await request.text() : undefined

    return fetch(url.toString(), {
      method: request.method,
      headers,
      body,
      cache: "no-store",
    })
  }

  let upstream = await forward(accessToken)

  if (upstream.status === 401) {
    const refreshed = await refreshAccessToken(jar)
    if (refreshed) {
      accessToken = refreshed
      upstream = await forward(accessToken)
    }
  }

  const text = await upstream.text()
  return new NextResponse(text, {
    status: upstream.status,
    headers: {
      "Content-Type": upstream.headers.get("Content-Type") || "application/json",
    },
  })
}

export const GET = proxy
export const POST = proxy
export const PATCH = proxy
export const PUT = proxy
export const DELETE = proxy
