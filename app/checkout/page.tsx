import { getCart } from "@/lib/api/customer/cart"
import { listAddresses } from "@/lib/api/customer/addresses"
import { mapCartItemForUi, mapCartSummary } from "@/lib/api/mappers"
import { isApiError } from "@/lib/api/errors"
import { placeOrderAction } from "@/actions/orders"
import { redirect } from "next/navigation"
import type { Metadata } from "next"
import Link from "next/link"
import { CheckoutForm } from "@/components/checkout/CheckoutForm"

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false, follow: false },
}

export default async function CheckoutPage() {
  try {
    const [cart, addresses] = await Promise.all([getCart(), listAddresses()])
    const items = cart.items.map(mapCartItemForUi)
    const summary = mapCartSummary(cart)

    return (
      <section className="py-12">
        <div className="container max-w-3xl">
          <h1 className="font-integral-bold text-[32px] text-primary">Checkout</h1>
          <p className="mt-2 text-black/60">Cash on delivery only.</p>

          <div className="mt-8 rounded-2xl border border-border-color p-6">
            <h2 className="text-xl font-satoshi-bold text-primary">Order summary</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {items.map((item) => (
                <li key={item.id} className="flex justify-between gap-3">
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>${item.itemTotal}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-between border-t pt-4 text-primary">
              <span>Total</span>
              <span className="font-satoshi-bold">${summary.total}</span>
            </div>
          </div>

          {addresses.length === 0 ? (
            <p className="mt-8 text-black/70">
              Add a shipping address first.{" "}
              <Link href="/account/addresses" className="underline">
                Manage addresses
              </Link>
            </p>
          ) : (
            <CheckoutForm addresses={addresses} placeOrderAction={placeOrderAction} />
          )}
        </div>
      </section>
    )
  } catch (error) {
    if (isApiError(error) && error.status === 401) {
      redirect("/login?next=/checkout")
    }
    redirect("/cart")
  }
}
