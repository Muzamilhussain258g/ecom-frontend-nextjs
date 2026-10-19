"use client"

import { useActionState } from "react"
import Button from "@/components/Button"
import type { Address } from "@/types/api/order"
import type { OrderActionResult } from "@/actions/orders"

interface CheckoutFormProps {
  addresses: Address[]
  placeOrderAction: (
    prev: OrderActionResult | undefined,
    formData: FormData,
  ) => Promise<OrderActionResult>
}

export function CheckoutForm({ addresses, placeOrderAction }: CheckoutFormProps) {
  const [state, formAction, pending] = useActionState(placeOrderAction, undefined)
  const defaultId = addresses.find((a) => a.isDefault)?.id ?? addresses[0]?.id

  return (
    <form action={formAction} className="mt-8 grid gap-4 rounded-2xl border border-border-color p-6">
      <h2 className="text-xl font-satoshi-bold text-primary">Shipping address</h2>
      <div className="grid gap-3">
        {addresses.map((address) => (
          <label
            key={address.id}
            className="flex cursor-pointer gap-3 rounded-xl border border-border-color p-4"
          >
            <input
              type="radio"
              name="shippingAddressId"
              value={address.id}
              defaultChecked={address.id === defaultId}
              required
            />
            <span>
              <span className="block font-satoshi-bold text-primary">{address.fullName}</span>
              <span className="block text-sm text-black/70">
                {address.street}, {address.city}, {address.province} {address.postalCode}
              </span>
            </span>
          </label>
        ))}
      </div>
      {state?.message && (
        <p className="text-sm text-red-600">{state.message}</p>
      )}
      <Button
        btnProps={{
          text: pending ? "Placing order..." : "Place COD order",
          variant: "black",
          className: "w-fit",
        }}
      />
    </form>
  )
}
