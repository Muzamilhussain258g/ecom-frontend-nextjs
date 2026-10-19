"use client"

import { useActionState } from "react"
import Button from "@/components/Button"
import type { ActionResult } from "@/actions/auth"

interface AccountFormsProps {
  name: string
  email: string
  updateProfileAction: (
    prev: ActionResult | undefined,
    formData: FormData,
  ) => Promise<ActionResult>
  changePasswordAction: (
    prev: ActionResult | undefined,
    formData: FormData,
  ) => Promise<ActionResult>
}

export function AccountForms({
  name,
  email,
  updateProfileAction,
  changePasswordAction,
}: AccountFormsProps) {
  const [profileState, profileAction, profilePending] = useActionState(
    updateProfileAction,
    undefined,
  )
  const [passwordState, passwordAction, passwordPending] = useActionState(
    changePasswordAction,
    undefined,
  )

  return (
    <div className="mt-10 grid gap-10">
      <form action={profileAction} className="grid gap-3 rounded-2xl border border-border-color p-6">
        <h2 className="text-xl font-satoshi-bold text-primary">Profile</h2>
        <label className="text-sm">
          Name
          <input
            name="name"
            defaultValue={name}
            className="mt-1 w-full rounded-full bg-tertiary px-4 py-3 outline-none"
          />
        </label>
        <label className="text-sm">
          Email
          <input
            name="email"
            type="email"
            defaultValue={email}
            className="mt-1 w-full rounded-full bg-tertiary px-4 py-3 outline-none"
          />
        </label>
        {profileState?.message && (
          <p className={`text-sm ${profileState.ok ? "text-green-700" : "text-red-600"}`}>
            {profileState.message}
          </p>
        )}
        <Button
          btnProps={{
            text: profilePending ? "Saving..." : "Save profile",
            variant: "black",
            className: "w-fit",
          }}
        />
      </form>

      <form action={passwordAction} className="grid gap-3 rounded-2xl border border-border-color p-6">
        <h2 className="text-xl font-satoshi-bold text-primary">Password</h2>
        <label className="text-sm">
          Current password
          <input
            name="currentPassword"
            type="password"
            required
            className="mt-1 w-full rounded-full bg-tertiary px-4 py-3 outline-none"
          />
        </label>
        <label className="text-sm">
          New password
          <input
            name="newPassword"
            type="password"
            required
            className="mt-1 w-full rounded-full bg-tertiary px-4 py-3 outline-none"
          />
        </label>
        {passwordState?.message && (
          <p className={`text-sm ${passwordState.ok ? "text-green-700" : "text-red-600"}`}>
            {passwordState.message}
          </p>
        )}
        <Button
          btnProps={{
            text: passwordPending ? "Updating..." : "Update password",
            variant: "black",
            className: "w-fit",
          }}
        />
      </form>
    </div>
  )
}
