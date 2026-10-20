"use client"

import { useActionState, useTransition } from "react"
import Button from "@/components/Button"
import type { Address } from "@/types/api/order"
import type { AddressActionResult } from "@/actions/addresses"
import { notifyAction } from "@/lib/action-toast"

interface AddressManagerProps {
  addresses: Address[]
  createAddressAction: (
    prev: AddressActionResult | undefined,
    formData: FormData,
  ) => Promise<AddressActionResult>
  deleteAddressAction: (id: number) => Promise<AddressActionResult>
}

export function AddressManager({
  addresses,
  createAddressAction,
  deleteAddressAction,
}: AddressManagerProps) {
  const [state, formAction, pending] = useActionState(
    (prev: AddressActionResult | undefined, data: FormData) =>
      notifyAction(() => createAddressAction(prev, data), "Address saved."), undefined)
  const [deleting, startTransition] = useTransition()

  return (
    <div className="mt-8 grid gap-8">
      <div className="grid gap-4">
        {addresses.length === 0 ? (
          <p className="text-black/60">No saved addresses yet.</p>
        ) : (
          addresses.map((address) => (
            <div key={address.id} className="rounded-2xl border border-border-color p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-satoshi-bold text-primary">
                    {address.fullName}{" "}
                    {address.isDefault && (
                      <span className="ml-2 rounded-full bg-tertiary px-2 py-0.5 text-xs">Default</span>
                    )}
                  </p>
                  <p className="mt-1 text-sm text-black/70">
                    {address.street}, {address.city}, {address.province} {address.postalCode}
                  </p>
                  <p className="text-sm text-black/70">{address.country} · {address.phone}</p>
                  <p className="mt-1 text-xs uppercase tracking-wide text-black/40">{address.label}</p>
                </div>
                <button
                  type="button"
                  disabled={deleting}
                  className="text-sm text-red-600"
                  onClick={() =>
                    startTransition(async () => {
                      await notifyAction(() => deleteAddressAction(address.id), "Address deleted.")
                    })
                  }
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <form action={formAction} className="grid gap-3 rounded-2xl border border-border-color p-6">
        <h2 className="text-xl font-satoshi-bold text-primary">Add address</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            ["label", "Label (home/office)", "home"],
            ["fullName", "Full name", ""],
            ["phone", "Phone", ""],
            ["street", "Street", ""],
            ["city", "City", ""],
            ["province", "Province", ""],
            ["postalCode", "Postal code", ""],
            ["country", "Country", ""],
          ].map(([name, label, placeholder]) => (
            <label key={name} className="text-sm">
              {label}
              <input
                name={name}
                required={name !== "label"}
                defaultValue={placeholder}
                className="mt-1 w-full rounded-full bg-tertiary px-4 py-3 outline-none"
              />
            </label>
          ))}
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="isDefault" />
          Set as default
        </label>
        {state?.message && (
          <p className={`text-sm ${state.ok ? "text-green-700" : "text-red-600"}`}>
            {state.message}
          </p>
        )}
        <Button
          btnProps={{
            text: pending ? "Saving..." : "Save address",
            disabled: pending,
            variant: "black",
            className: "w-fit",
          }}
        />
      </form>
    </div>
  )
}
