"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import * as authApi from "@/lib/api/customer/auth"
import {
  clearAuthCookies,
  getRefreshSession,
  setAuthCookies,
} from "@/lib/api/cookies"
import { isApiError } from "@/lib/api/errors"

export type ActionResult = {
  ok: boolean
  message?: string
}

export async function signUpAction(
  _prev: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  const name = String(formData.get("name") || "").trim()
  const email = String(formData.get("email") || "").trim()
  const password = String(formData.get("password") || "")

  if (!name || !email || !password) {
    return { ok: false, message: "All fields are required." }
  }

  try {
    await authApi.signUp({ name, email, password })
    const session = await authApi.signIn({ email, password })
    await setAuthCookies({
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
      refreshTokenId: session.refreshTokenId,
    })
  } catch (error) {
    return {
      ok: false,
      message: isApiError(error) ? error.message : "Sign up failed.",
    }
  }

  redirect("/account")
}

export async function signInAction(
  _prev: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  const email = String(formData.get("email") || "").trim()
  const password = String(formData.get("password") || "")
  const next = String(formData.get("next") || "/account")

  if (!email || !password) {
    return { ok: false, message: "Email and password are required." }
  }

  try {
    const session = await authApi.signIn({ email, password })
    await setAuthCookies({
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
      refreshTokenId: session.refreshTokenId,
    })
  } catch (error) {
    return {
      ok: false,
      message: isApiError(error) ? error.message : "Invalid email or password.",
    }
  }

  redirect(next.startsWith("/") ? next : "/account")
}

export async function signOutAction() {
  const { refreshToken, refreshTokenId } = await getRefreshSession()
  try {
    if (refreshToken && refreshTokenId) {
      await authApi.signOut({ refreshToken, refreshTokenId })
    }
  } catch {
    // ignore API errors on logout
  }
  await clearAuthCookies()
  revalidatePath("/")
  redirect("/")
}

export async function updateProfileAction(
  _prev: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  const name = String(formData.get("name") || "").trim()
  const email = String(formData.get("email") || "").trim()

  try {
    await authApi.updateProfile({
      ...(name ? { name } : {}),
      ...(email ? { email } : {}),
    })
    revalidatePath("/account")
    return { ok: true, message: "Profile updated." }
  } catch (error) {
    return {
      ok: false,
      message: isApiError(error) ? error.message : "Update failed.",
    }
  }
}

export async function changePasswordAction(
  _prev: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  const currentPassword = String(formData.get("currentPassword") || "")
  const newPassword = String(formData.get("newPassword") || "")

  try {
    await authApi.changePassword({ currentPassword, newPassword })
    return { ok: true, message: "Password updated." }
  } catch (error) {
    return {
      ok: false,
      message: isApiError(error) ? error.message : "Password change failed.",
    }
  }
}
