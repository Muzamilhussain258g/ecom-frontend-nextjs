"use client"

import Link from "next/link"

export default function ErrorPage({ unstable_retry }: { unstable_retry: () => void }) {
  return <div className="container py-12" role="alert">
    <h1 className="text-2xl font-bold">Unable to load this page</h1>
    <p className="my-4">Please try again. If you changed product filters, reset them and retry.</p>
    <button className="rounded-full bg-black px-6 py-3 text-white" onClick={unstable_retry}>Try again</button>
    <Link className="ml-4 underline" href="/products">Reset product filters</Link>
  </div>
}
