import { apiFetch } from "../client"
import type {
  AuthUser,
  RefreshPayload,
  SignInPayload,
  SignInResult,
  SignUpPayload,
  UpdatePasswordPayload,
  UpdateProfilePayload,
} from "@/types/api/auth"

export function signUp(payload: SignUpPayload) {
  return apiFetch<{ id: number; name: string; email: string }>({
    path: "/auth/signup",
    method: "POST",
    body: payload,
    cache: "no-store",
  })
}

export function signIn(payload: SignInPayload) {
  return apiFetch<SignInResult>({
    path: "/auth/signin",
    method: "POST",
    body: payload,
    cache: "no-store",
  })
}

export function refreshAccessToken(payload: RefreshPayload) {
  return apiFetch<{
    newAccessToken: string
  }>({
    path: "/auth/refresh",
    method: "POST",
    body: payload,
    cache: "no-store",
  })
}

export function signOut(payload: RefreshPayload) {
  return apiFetch<unknown>({
    path: "/auth/signout",
    method: "POST",
    body: payload,
    cache: "no-store",
  })
}

export function getMe() {
  return apiFetch<AuthUser>({
    path: "/auth/me",
    auth: true,
    cache: "no-store",
  })
}

export function updateProfile(payload: UpdateProfilePayload) {
  return apiFetch<AuthUser>({
    path: "/auth/profile",
    method: "PATCH",
    body: payload,
    auth: true,
    cache: "no-store",
  })
}

export function changePassword(payload: UpdatePasswordPayload) {
  return apiFetch<unknown>({
    path: "/auth/password",
    method: "PATCH",
    body: payload,
    auth: true,
    cache: "no-store",
  })
}
