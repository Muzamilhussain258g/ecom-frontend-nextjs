"use client"

import { signUpAction, type ActionResult } from "@/actions/auth"
import Button from "@/components/Button"
import Link from "next/link"
import { useActionState } from "react"

export default function SignupPage() {
  const [state, formAction, pending] = useActionState<ActionResult | undefined, FormData>(
    signUpAction,
    undefined,
  )

  return (
    <section className="py-16">
      <div className="container max-w-md">
        <h1 className="font-integral-bold text-[32px] text-primary">Create account</h1>
        <p className="mt-2 text-black/60">
          Already have an account?{" "}
          <Link href="/login" className="underline">
            Sign in
          </Link>
        </p>

        <form action={formAction} className="mt-8 grid gap-4">
          <label className="text-sm text-primary">
            Name
            <input
              name="name"
              required
              className="mt-1 w-full rounded-full bg-tertiary px-4 py-3 outline-none"
              placeholder="Alex Johnson"
            />
          </label>
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
              minLength={8}
              className="mt-1 w-full rounded-full bg-tertiary px-4 py-3 outline-none"
              placeholder="Min 8 chars, mixed case, number, symbol"
            />
          </label>
          {state?.message && (
            <p className="text-sm text-red-600">{state.message}</p>
          )}
          <Button
            btnProps={{
              text: pending ? "Creating..." : "Sign up",
              variant: "black",
              className: "w-full",
            }}
          />
        </form>
      </div>
    </section>
  )
}
