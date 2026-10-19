export const API_BASE_URL =
  process.env.API_BASE_URL?.replace(/\/$/, "") ||
  "http://localhost:8000/api/v1"

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "http://localhost:3000"

export const AUTH_COOKIE = {
  accessToken: "access_token",
  refreshToken: "refresh_token",
  refreshTokenId: "refresh_token_id",
} as const

export function getDefaultHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    Accept: "application/json",
  }

  if (API_BASE_URL.includes("ngrok")) {
    headers["ngrok-skip-browser-warning"] = "true"
  }

  return headers
}
