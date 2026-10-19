import Link from "next/link"
import Button from "@/components/Button"

export default function NotFound() {
  return (
    <section className="py-24">
      <div className="container text-center">
        <h1 className="font-integral-bold text-[40px] text-primary">Page not found</h1>
        <p className="mt-3 text-black/60">The page you requested does not exist.</p>
        <Link href="/" className="mt-8 inline-block">
          <Button btnProps={{ text: "Back to home", variant: "black" }} />
        </Link>
      </div>
    </section>
  )
}
