import { cookies } from "next/headers"
import { AUTH_COOKIE } from "./config"

export async function getAccessToken(): Promise<string | undefined> {
  const jar = await cookies()
  return jar.get(AUTH_COOKIE.accessToken)?.value
}

export async function getRefreshSession(): Promise<{
  refreshToken?: string
  refreshTokenId?: string
}> {
  const jar = await cookies()
  return {
    refreshToken: jar.get(AUTH_COOKIE.refreshToken)?.value,
    refreshTokenId: jar.get(AUTH_COOKIE.refreshTokenId)?.value,
  }
}

export async function setAuthCookies(tokens: {
  accessToken: string
  refreshToken: string
  refreshTokenId: string
}) {
  const jar = await cookies()
  const secure = process.env.NODE_ENV === "production"
  const common = {
    httpOnly: true,
    secure,
    sameSite: "lax" as const,
    path: "/",
  }

  jar.set(AUTH_COOKIE.accessToken, tokens.accessToken, {
    ...common,
    maxAge: 60 * 15,
  })
  jar.set(AUTH_COOKIE.refreshToken, tokens.refreshToken, {
    ...common,
    maxAge: 60 * 60 * 24 * 7,
  })
  jar.set(AUTH_COOKIE.refreshTokenId, tokens.refreshTokenId, {
    ...common,
    maxAge: 60 * 60 * 24 * 7,
  })
}

export async function clearAuthCookies() {
  const jar = await cookies()
  jar.delete(AUTH_COOKIE.accessToken)
  jar.delete(AUTH_COOKIE.refreshToken)
  jar.delete(AUTH_COOKIE.refreshTokenId)
}

export async function hasAuthSession(): Promise<boolean> {
  const jar = await cookies()
  return Boolean(
    jar.get(AUTH_COOKIE.accessToken)?.value ||
      jar.get(AUTH_COOKIE.refreshToken)?.value,
  )
}
