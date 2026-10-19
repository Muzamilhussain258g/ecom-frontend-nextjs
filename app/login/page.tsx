"use client"

import { signInAction, type ActionResult } from "@/actions/auth"
import Button from "@/components/Button"
import Link from "next/link"
import { useActionState } from "react"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

function LoginForm() {
  const searchParams = useSearchParams()
  const next = searchParams.get("next") || "/account"
  const [state, formAction, pending] = useActionState<ActionResult | undefined, FormData>(
    signInAction,
    undefined,
  )

  return (
    <section className="py-16">
      <div className="container max-w-md">
        <h1 className="font-integral-bold text-[32px] text-primary">Sign in</h1>
        <p className="mt-2 text-black/60">
          Welcome back to SHOP.CO.{" "}
          <Link href="/signup" className="underline">
            Create an account
          </Link>
        </p>

        <form action={formAction} className="mt-8 grid gap-4">
          <input type="hidden" name="next" value={next} />
          <label className="text-sm text-primary">
            Email
            <input
              name="email"
              type="email"
              required
              className="mt-1 w-full rounded-full bg-tertiary px-4 py-3 outline-none"
              placeholder="you@example.com"
            />
          </label>
          <label className="text-sm text-primary">
            Password
            <input
              name="password"
              type="password"
              required
              className="mt-1 w-full rounded-full bg-tertiary px-4 py-3 outline-none"
              placeholder="••••••••"
            />
          </label>
          {state?.message && (
            <p className="text-sm text-red-600">{state.message}</p>
          )}
          <Button
            btnProps={{
              text: pending ? "Signing in..." : "Sign in",
              variant: "black",
              className: "w-full",
            }}
          />
        </form>
      </div>
    </section>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="container py-16">Loading...</div>}>
      <LoginForm />
    </Suspense>
  )
}
