"use client"

import { useCallback, useEffect, useState } from "react"
import { customerBrowserFetch } from "@/lib/api/browser"
import type { Address, CreateAddressPayload } from "@/types/api/order"
import { AddressManager } from "@/components/account/AddressManager"
import { Skeleton } from "@/components/ui/skeleton"
import type { AddressActionResult } from "@/actions/addresses"

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await customerBrowserFetch<Address[]>("/addresses")
      setAddresses(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load addresses")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const createAddressAction = async (
    _prev: AddressActionResult | undefined,
    formData: FormData,
  ): Promise<AddressActionResult> => {
    const payload: CreateAddressPayload = {
      label: String(formData.get("label") || "home"),
      fullName: String(formData.get("fullName") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      street: String(formData.get("street") || "").trim(),
      city: String(formData.get("city") || "").trim(),
      province: String(formData.get("province") || "").trim(),
      postalCode: String(formData.get("postalCode") || "").trim(),
      country: String(formData.get("country") || "").trim(),
      isDefault: formData.get("isDefault") === "on",
    }

    try {
      await customerBrowserFetch<Address>("/addresses", {
        method: "POST",
        body: payload,
      })
      await load()
      return { ok: true, message: "Address saved." }
    } catch (err) {
      return {
        ok: false,
        message: err instanceof Error ? err.message : "Could not save address.",
      }
    }
  }

  const deleteAddressAction = async (id: number): Promise<AddressActionResult> => {
    try {
      await customerBrowserFetch(`/addresses/${id}`, { method: "DELETE" })
      await load()
      return { ok: true }
    } catch (err) {
      return {
        ok: false,
        message: err instanceof Error ? err.message : "Could not delete address.",
      }
    }
  }

  if (loading) {
    return (
      <div className="grid max-w-3xl gap-4">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-40 w-full" />
      </div>
    )
  }

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>
  }

  return (
    <div className="w-full max-w-3xl text-left">
      <h1 className="font-integral-bold text-left text-[32px] text-primary">Addresses</h1>
      <AddressManager
        addresses={addresses}
        createAddressAction={createAddressAction}
        deleteAddressAction={deleteAddressAction}
      />
    </div>
  )
}
