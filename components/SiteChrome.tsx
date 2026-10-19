"use client"

import { usePathname } from "next/navigation"
import Footer from "@/components/Footer"
import UpToDateSection from "@/sections/homepageS/UpToDateSection"

/** Marketing footer + newsletter — hidden on authenticated account pages. */
export function SiteFooterChrome() {
  const pathname = usePathname()
  if (pathname.startsWith("/account")) return null

  return (
    <>
      <UpToDateSection />
      <Footer />
    </>
  )
}
