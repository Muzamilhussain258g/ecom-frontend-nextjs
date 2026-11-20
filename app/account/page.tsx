"use client"

import { useEffect, useState } from "react"
import { customerBrowserFetch } from "@/lib/api/browser"
import type { ActionResult } from "@/actions/auth"
import type { AuthUser } from "@/types/api/auth"
import { AccountForms } from "@/components/account/AccountForms"
import { Skeleton } from "@/components/ui/skeleton"

export default function AccountPage() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const me = await customerBrowserFetch<AuthUser>("/auth/me")
        if (!cancelled) setUser(me)
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load profile")
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const updateProfile = async (
    _prev: ActionResult | undefined,
    formData: FormData,
  ): Promise<ActionResult> => {
    const name = String(formData.get("name") || "").trim()
    const email = String(formData.get("email") || "").trim()

    try {
      const updatedUser = await customerBrowserFetch<AuthUser>("/auth/profile", {
        method: "PATCH",
        body: {
          ...(name ? { name } : {}),
          ...(email ? { email } : {}),
        },
      })
      setUser(updatedUser)
      return { ok: true, message: "Profile updated." }
    } catch (err) {
      return {
        ok: false,
        message: err instanceof Error ? err.message : "Update failed.",
      }
    }
  }

  const changePassword = async (
    _prev: ActionResult | undefined,
    formData: FormData,
  ): Promise<ActionResult> => {
    const currentPassword = String(formData.get("currentPassword") || "")
    const newPassword = String(formData.get("newPassword") || "")

    try {
      await customerBrowserFetch("/auth/password", {
        method: "PATCH",
        body: { currentPassword, newPassword },
      })
      return { ok: true, message: "Password updated." }
    } catch (err) {
      return {
        ok: false,
        message: err instanceof Error ? err.message : "Password change failed.",
      }
    }
  }

  if (loading) {
    return (
      <div className="grid max-w-3xl gap-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-4 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (error || !user) {
    return <p className="text-sm text-red-600">{error || "Unable to load account."}</p>
  }

  return (
    <div className="w-full max-w-3xl text-left">
      <h1 className="font-integral-bold text-left text-[32px] text-primary">Profile</h1>
      <p className="mt-2 text-black/60">Signed in as {user.email}</p>
      <AccountForms
        key={`${user.name}:${user.email}`}
        name={user.name}
        email={user.email}
        updateProfile={updateProfile}
        changePassword={changePassword}
      />
    </div>
  )
}
