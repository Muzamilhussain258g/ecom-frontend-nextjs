import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { API_BASE_URL, AUTH_COOKIE, getDefaultHeaders } from "@/lib/api/config"

export async function GET() {
  const jar = await cookies()
  let accessToken = jar.get(AUTH_COOKIE.accessToken)?.value

  if (accessToken) {
    const me = await fetch(`${API_BASE_URL}/auth/me`, {
      method: "GET",
      headers: { ...getDefaultHeaders(), Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    })
    if (me.ok) return NextResponse.json({ accessToken })
  }

  const refreshToken = jar.get(AUTH_COOKIE.refreshToken)?.value
  const refreshTokenId = jar.get(AUTH_COOKIE.refreshTokenId)?.value
  if (!refreshToken || !refreshTokenId) {
    return NextResponse.json({ accessToken: null }, { status: 401 })
  }

  const refreshed = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: { ...getDefaultHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken, refreshTokenId }),
    cache: "no-store",
  })
  if (!refreshed.ok) {
    return NextResponse.json({ accessToken: null }, { status: 401 })
  }

  const payload = await refreshed.json() as {
    data?: { newAccessToken?: string; accessToken?: string }
  }
  accessToken = payload.data?.newAccessToken || payload.data?.accessToken
  if (!accessToken) return NextResponse.json({ accessToken: null }, { status: 401 })

  jar.set(AUTH_COOKIE.accessToken, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 15,
  })

  return NextResponse.json({ accessToken })
}
